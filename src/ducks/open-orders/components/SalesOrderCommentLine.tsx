import React, {ChangeEvent} from 'react';
import classNames from "classnames";
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "../../../types/generic";
import FilledInput from "@mui/material/Input";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Box from "@mui/material/Box";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";

const SalesOrderCommentLine = ({line, readOnly, onChange, onDelete}: {
    line: SalesOrderDetailLine & Editable & Appendable;
    readOnly?: boolean;
    onChange: (value: string) => void;
    onDelete?: () => void;
}) => {
    const rowClassName = {
        'table-warning': line.changed,
        'table-info': line.newLine,
    }

    const changeHandler = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(ev.target.value);
    }

    return (
        <tr className={classNames('order-detail line-comment', rowClassName)}>
            {line.ItemType === '4' && (<td className="text-center"><TextSnippetIcon/></td>)}
            <td colSpan={4}>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <FilledInput value={line.CommentText ?? ''} fullWidth size="small"
                                 sx={{flex: '1 1 auto'}}
                                 inputProps={{readOnly}}
                                 multiline maxRows={4} minRows={1}
                                 onChange={changeHandler}
                                 endAdornment={<IconButton size="small" onClick={onDelete}><ClearIcon/></IconButton>}/>
                </Box>
            </td>
            <td colSpan={3}>&nbsp;</td>
            {line.ItemType === '4' && (<td>&nbsp;</td>)}
        </tr>
    )
}
export default SalesOrderCommentLine;
