import {getContrastRatio, styled} from '@mui/material/styles';
import Chip, {ChipProps} from "@mui/material/Chip";


const BaseMiniChip = styled(Chip)`
    height: 1rem;
    font-size: 0.625rem;
    border-radius: 6px;
`

export interface MiniChipProps extends ChipProps {
    bgColor?: string;
    textColor?: string;
}

const MiniChip = ({bgColor, textColor, color, label, sx, ...props}:MiniChipProps) => {
    if (!!bgColor && !textColor) {
        textColor = getContrastRatio(bgColor, '#FFF') > 4.5 ? '#FFF' : '#000'
    }

    return (
        <BaseMiniChip label={label} color={color}
                      sx={{...sx, color: textColor, backgroundColor: bgColor, mr: '2px'}} {...props} size="small"/>
    )
}
export default MiniChip;
