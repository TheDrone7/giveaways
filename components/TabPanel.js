import { Box } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  fullWidth: { width: '100%' }
})

export default function TabPanel (props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (<div
    role='tabpanel'
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tabpanel-${index}`}
    className={classes.fullWidth}
    {...other}
  >
    {value === index && (children)}
  </div>)
}