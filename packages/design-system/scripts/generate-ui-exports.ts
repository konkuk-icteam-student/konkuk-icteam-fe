import { access, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const UI_DIR = join(ROOT_DIR, 'src/ui');
const INDEX_FILE = join(UI_DIR, 'index.ts');
const PACKAGE_JSON_FILE = join(ROOT_DIR, 'package.json');

// package.json exports 중 이 스크립트가 관리하는 항목의 경로 접두사
const UI_EXPORT_PREFIX = './src/ui/';

const INDEX_FILE_NAMES = ['index.ts', 'index.tsx'];

const HEADER_COMMENT = ['/**', ' * ⚠️ 자동 생성된 파일입니다. 직접 수정하지 마세요.', ' */'].join(
  '\n',
);

const hasIndexFile = async (dir: string) => {
  const results = await Promise.all(
    INDEX_FILE_NAMES.map((name) =>
      access(join(dir, name)).then(
        () => true,
        () => false,
      ),
    ),
  );
  return results.some(Boolean);
};

const getUiFolders = async () => {
  const entries = await readdir(UI_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};

const createIndexContent = (folders: string[]) => {
  // 모듈로 인식되도록 폴더가 없어도 빈 export를 남긴다
  const exportLines =
    folders.length > 0
      ? folders.map((folder) => `export * from './${folder}';`).join('\n')
      : 'export {};';

  return `${HEADER_COMMENT}\n\n${exportLines}\n`;
};

type PackageJson = {
  exports?: Record<string, string>;
  [key: string]: unknown;
};

const updatePackageExports = async () => {
  const raw = await readFile(PACKAGE_JSON_FILE, 'utf-8');
  const packageJson = JSON.parse(raw) as PackageJson;

  // ui 외 항목은 그대로 두고 './ui' 항목만 다시 만든다
  const unmanagedExports = Object.entries(packageJson.exports ?? {}).filter(
    ([, path]) => !path.startsWith(UI_EXPORT_PREFIX),
  );
  // 폴더별 엔트리 없이 './ui' 하나로만 내보낸다 (src/ui/index.ts가 모든 폴더를 다시 내보낸다)
  const uiExports = [['./ui', `${UI_EXPORT_PREFIX}index.ts`]];

  const nextPackageJson = {
    ...packageJson,
    exports: Object.fromEntries([...uiExports, ...unmanagedExports]),
  };
  const nextRaw = `${JSON.stringify(nextPackageJson, null, 2)}\n`;

  if (nextRaw === raw) return;
  await writeFile(PACKAGE_JSON_FILE, nextRaw, 'utf-8');
};

export default async function generate() {
  try {
    const folders = await getUiFolders();
    const hasIndexList = await Promise.all(
      folders.map((folder) => hasIndexFile(join(UI_DIR, folder))),
    );

    const exportableFolders = folders.filter((_, index) => hasIndexList[index]);
    const skippedFolders = folders.filter((_, index) => !hasIndexList[index]);

    skippedFolders.forEach((folder) => {
      console.warn(`⚠️ src/ui/${folder}: index 파일이 없어 export에서 제외했습니다`);
    });

    await writeFile(INDEX_FILE, createIndexContent(exportableFolders), 'utf-8');
    await updatePackageExports();

    console.info(
      `🎉 ui barrel export와 package.json의 './ui' export를 생성했습니다 (${exportableFolders.length}개 폴더)`,
    );
  } catch (e) {
    console.error('❌ 에러:', e);
    process.exit(1);
  }
}

void generate();
