import React, {ChangeEvent} from 'react';
import classNames from "classnames";
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "../../../types/generic";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Box from "@mui/material/Box";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import TableRow from '@mui/material/TableRow';
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";


export interface SalesOrderCommentLineProps {
    line: SalesOrderDetailLine & Editable & Appendable;
    readOnly?: boolean;
    onChange: (value: string) => void;
    onDelete?: () => void;
}

export default React.forwardRef(function SalesOrderCommentLine({
                                                                   line,
                                                                   readOnly,
                                                                   onChange,
                                                                   onDelete
                                                               }: SalesOrderCommentLineProps,
                                                               ref: React.Ref<HTMLInputElement>) {
    const rowClassName = {
        'table-warning': line.changed,
        'table-info': line.newLine,
    }

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(ev.target.value);
    }

    return (
        <TableRow className={classNames(rowClassName)}>
            {line.ItemType === '4' && (<TableCell className="text-center"><TextSnippetIcon/></TableCell>)}
            <TableCell colSpan={3}>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField value={line.CommentText ?? ''} fullWidth size="small" variant="filled"
                               ref={ref}
                               label="Item Comment"
                               sx={{flex: '1 1 auto'}}
                               inputProps={{readOnly, maxLength: 2048}}
                               multiline maxRows={4} minRows={1}
                               onChange={changeHandler}
                               InputProps={{
                                   endAdornment: <IconButton size="small" onClick={onDelete}><ClearIcon/></IconButton>,
                               }}

                    />
                </Box>
            </TableCell>
            <TableCell colSpan={4}>&nbsp;</TableCell>
            {line.ItemType === '4' && (<TableCell>&nbsp;</TableCell>)}
        </TableRow>
    )
})

