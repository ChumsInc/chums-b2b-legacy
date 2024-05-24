import {useSelector} from "react-redux";
import {selectCustomerReturnToPath} from "../selectors";
import Alert from "@mui/material/Alert";
import {useNavigate} from "react-router";
import {useAppDispatch} from "../../../app/configureStore";
import {setReturnToPath} from "../actions";
import {Link as NavLink} from 'react-router-dom'
import Link from "@mui/material/Link";


const returnPathText = (path: string): string => {
    if (path.startsWith('/products')) {
        return 'Continue Shopping';
    }
    return `Return to ${path}`;
}
const ReturnToAlert = () => {
    const dispatch = useAppDispatch();
    const returnToPath = useSelector(selectCustomerReturnToPath);
    const navigate = useNavigate();

    if (!returnToPath) {
        return null;
    }

    const onCancel = () => {
        dispatch(setReturnToPath(null));
    }

    return (
        <Alert severity="info" onClose={onCancel}>
            <Link component={NavLink} to={returnToPath}>{returnPathText(returnToPath)}</Link>
        </Alert>
    )
}

export default ReturnToAlert;
