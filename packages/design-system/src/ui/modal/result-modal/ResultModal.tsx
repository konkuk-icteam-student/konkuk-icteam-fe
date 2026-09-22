import { ResultModalType } from './types/resultModalType';
import { Modal, ModalButtonProps } from '../base/Modal';
import { THEME } from './constants/theme';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconCheck, IconClose } from '@konkuk-icteam-fe/design-system/assets';

type ResultModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  showCloseButton?: boolean;
  type: ResultModalType;
  title: string;
  description?: string;
  buttons: ModalButtonProps[];
  layoutClassName?: string;
  headerClassName?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  footerClassName?: string;
};

export default function ResultModal({
  open,
  handleOpenChange,
  showCloseButton = false,
  type,
  title,
  description,
  buttons,
  layoutClassName,
  headerClassName,
  containerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
}: ResultModalProps) {
  const { contentTheme, headerTheme, graphicTheme } = THEME[type];

  return (
    <Modal
      open={open}
      handleOpenChange={handleOpenChange}
      showCloseButton={showCloseButton}
      className={cn(
        'bg-black-1 flex w-[28.1rem] flex-col justify-center rounded-[0.6rem] border-0',
        contentTheme,
        layoutClassName,
      )}
    >
      <Modal.Header className={cn('flex flex-col items-center', headerTheme, headerClassName)}>
        <div
          aria-hidden='true'
          className={cn(
            'text-black-1 flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-full',
            graphicTheme,
          )}
        >
          {type === 'success' ? (
            <IconCheck className='h-[2rem] w-[2rem]' />
          ) : (
            <IconClose className='h-[2.8rem] w-[2.8rem]' />
          )}
        </div>
        <div
          className={cn(
            'flex flex-col items-center',
            description && 'gap-[0.4rem]',
            containerClassName,
          )}
        >
          <Modal.Title className={cn('font-16-md whitespace-pre-line text-black', titleClassName)}>
            {title}
          </Modal.Title>
          {description && (
            <Modal.Description className={cn('caption-12-md text-gray-500', descriptionClassName)}>
              {description}
            </Modal.Description>
          )}
        </div>
      </Modal.Header>
      <Modal.Footer className={cn('flex flex-row gap-[0.5rem]', footerClassName)}>
        <Modal.Buttons buttons={buttons} />
      </Modal.Footer>
    </Modal>
  );
}
