import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {selectSalesOrderActionStatus} from "../../open-orders/selectors";
import {addCartComment} from "../actions";

export default function CartCommentInput({salesOrderNo}: {
    salesOrderNo: string
}) {
    const dispatch = useAppDispatch();
    const actionStatus = useAppSelector((state) => selectSalesOrderActionStatus(state, salesOrderNo));
    const [text, setText] = useState<string>('');

    const saveHandler = async () => {
        if (!text.trim()) {
            return;
        }
        await dispatch(addCartComment({
            salesOrderNo,
            comment: text.trim()
        }));
        setText('');
    }

    return (
        <Stack spacing={1} direction="row" sx={{flex: '1 1 auto'}}>
            <TextField label="Add Cart Comment" value={text} onChange={(ev) => setText(ev.target.value)}
                       variant="filled" size="small" multiline fullWidth/>
            <Button color="primary" variant="text" type="button" size="small"
                    onClick={saveHandler}
                    disabled={!text || actionStatus !== 'idle'}>
                Save
            </Button>
        </Stack>
    )
}
