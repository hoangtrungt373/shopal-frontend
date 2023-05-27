import {Box, Typography} from "@mui/material";
import {TabPanelProps} from "../../../model/common/TabPanelProps";
import {isNotNull} from "../../../util/object.util";

export function TabPanel(props: TabPanelProps) {
    const {children, value, index, padding, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: isNotNull(padding) ? padding : 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
