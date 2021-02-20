import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, teal } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: blue[200],
      main: blue[600],
      dark: blue[800]
    },
    secondary: {
      light: teal[200],
      main: teal[500],
      dark: teal[700]
    },
    error: {
      light: red[400],
      main: red[800],
      dark: red[900]
    }
  },
});

export default theme;
