import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import SellRoundedIcon from '@mui/icons-material/SellRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// component
import SellIcon from '@mui/icons-material/Sell';
//import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function UserMoreMenu({
  refId,
  refName,
  handleModalOpen,
  formik,
  handleModalClose,
  setSnackColor,
  setSnackMessage,
  setSnackOpen,
}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVertRoundedIcon />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            formik.values.stockId = refId;
            formik.values.name = refName;
            handleModalOpen();
            setIsOpen(false);
          }}
        >
          <ListItemIcon>
            <SellRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sell"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
