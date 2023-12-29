import type { ModalFuncProps, ModalProps } from 'antd';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { Modal } from 'antd';
export type showDialogProps = Omit<ModalStaticFunctions, 'warn'>;

function Dialog(prop: ModalProps) {
  return (
    <Modal
      {...{
        width: 860,
        icon: null,
        closable: true,
        footer: null,
        centered: true,
        ...prop,
        className: `${prop.className} chagee-dialog`,
        // title: <h3 style={{ textAlign: 'center' }}>查看详情</h3>,
      }}
    />
  );
}

export function showDialog(
  modal: showDialogProps,
  content: React.ReactNode,
  props?: Omit<ModalFuncProps, 'content'> & { noSile?: boolean },
) {
  const prams: ModalFuncProps = {
    icon: null,
    closable: true,
    footer: null,
    centered: true,
    width: 860,
    className: `chagee-dialog ${props?.noSile ? 'no-slide' : ''}`,
    content,
    ...props,
  };
  modal.info(prams);
}

Dialog.showDialog = showDialog;
Dialog.useModal = Modal.useModal;
export const useModal = Modal.useModal;

export default Dialog;
