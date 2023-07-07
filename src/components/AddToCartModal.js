import React from 'react';
import ModalAlert from "./ModalAlert";
import AddToCartContainer from "./AddToCartContainer";


const AddToCartModal = ({itemCode, quantity, comment, onClose}) => {
    return (
        <ModalAlert title="Add to Cart" onClose={onClose} size="md">
            <AddToCartContainer onClose={onClose}
                                itemCode={itemCode}
                                quantity={quantity}
                                comment={comment}/>
        </ModalAlert>
    );
}

export default AddToCartModal;

