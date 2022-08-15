import './modal.scss';

export const getTemplate = () => {
  return `<div data-modal-id="modal" class="modal hidden">
            <div class="modal_content">
              <span data-modal-id="close" class="close_modal_window">×</span>
              <div data-modal-id="message" class="popup-content"></div>
            </div>
          </div>`;
};
