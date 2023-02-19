import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {

   const inputRef = useRef();

   const buttonText = `${props.renderLoading ? 'Сохранение...' : 'Сохранить'}`;

   const handleSubmit = (evt) => {
      evt.preventDefault();

      props.onUpdateAvatar({
         avatar: inputRef.current.value
      });
   };

   useEffect(() => {
      inputRef.current.value = '';
   }, [props.isOpen]);

   return(
      <PopupWithForm
         isOpen={props.isOpen}
         onClose={props.onClose}
         onCloseClick={props.onCloseClick}
         onSubmit={handleSubmit}
         title={'Обновить аватар'}
         name={'avatar-form'}
         formId={'#avatar-update-form'}
         buttonId={'#avatar-form-save-button'}
         buttonText={buttonText}
      >
         <input ref={inputRef} className="popup__input popup__input_avatar-link" name="inputAvatarLink" type="url" placeholder="Ссылка на картинку" required/>
         <span className="popup__input-error"></span>
      </PopupWithForm>
   )
}

export default EditAvatarPopup;