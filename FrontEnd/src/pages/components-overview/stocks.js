import { format } from 'date-fns';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
// components
import MainCard from './../../components/MainCard';
//import Iconify from '../components/Iconify';
//import SearchNotFound from '../components/SearchNotFound';
import { StockListHead, StockListToolbar, StockMoreMenu } from './../Stocks';
// mock
import USERLIST from './../../components/user';
import UserMoreMenu from 'pages/Stocks/StockMoreMenu';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';

import { LoadingButton } from '@mui/lab';

import axios from 'axios';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'seller', label: 'Seller', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65%',
  // padding: '44px',
  // height: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const Stocks = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  // --------------------------------------

  // SnackBar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState(
    'Stocks fetched successfully!'
  );
  const [snackColor, setSnackColor] = useState('success');

  const [stockData, setStockData] = useState([]);

  const [dataChange, setDataChange] = useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };
  // --------------------------------------

  const SellSchema = Yup.object().shape({
    stockId: Yup.string(),
    name: Yup.string(),
    amount: Yup.number().required('Amount is required'),
    quantity: Yup.number().required('Quantity is required'),
    paymentMode: Yup.string()
      .min(3, 'Too short!')
      .max(10, 'Too long!')
      .required('Payment Mode is required!'),
    transactionId: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required(),
    customerName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required(),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required(),
    phoneNo: Yup.string()
      .min(8, 'Too Short!')
      .max(12, 'Too Long!')
      .required('Phone No required'),
  });

  const formik = useFormik({
    initialValues: {
      stockId: '',
      name: '',
      amount: '',
      quantity: '',
      paymentMode: '',
      transactionId: '',
      customerName: '',
      address: '',
      phoneNo: '',
    },
    validationSchema: SellSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.put(
          'http://localhost:5000/api/admin/sellStock',
          {
            data: {
              stockId: values.stockId,
              amount: values.amount,
              quantity: values.quantity,
              paymentMode: values.paymentMode,
              transactionId: values.transactionId,
              customer: {
                name: values.customerName,
                address: values.address,
                phoneNo: values.phoneNo,
              },
            },
          },
          options
        );
        setSnackColor('success');
        setSnackMessage(data.message);
        setSnackOpen(true);
        handleModalClose();
        setDataChange(!dataChange);
        values.amount = '';
        values.quantity = '';
        values.paymentMode = '';
        values.transactionId = '';
        values.customerName = '';
        values.address = '';
        values.phoneNo = '';
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/admin/getAllStocks',
          options
        );
        // console.log(data.data);

        const responsedata = data.data;
        console.log(responsedata);
        const finalData = [];

        responsedata.forEach((element, index) => {
          const temp = {};
          temp.name = element.name;
          temp.id = element.stockId;
          temp.date = new Date(element.datePurchased);
          temp.amount = element.amount;
          temp.quantity = element.quantity;
          temp.seller = element.seller.name;
          temp.category = element.category.name;
          temp.avatarUrl = `/static/avatars/avatar.jpg`;

          finalData.push(temp);
        });

        // console.log(finalData);
        setStockData(finalData);
      } catch (err) {
        setSnackColor('error');
        setSnackMessage(err?.response?.data?.error);
        setSnackOpen(true);
      }
    };

    fetchStocks().then();
  }, [dataChange]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = stockData.map((n) => {
        console.log(n.id);
        return n.name;
      });
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    // console.log(selected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stockData.length) : 0;

  const filteredUsers = applySortFilter(
    stockData,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <MainCard title="Stocks">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Stocks
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/home/createstock"
          >
            Add Stock
          </Button>
        </Stack>

        <Card>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <StockListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={stockData.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const {
                      id,
                      name,
                      category,
                      seller,
                      avatarUrl,
                      quantity,
                      amount,
                      date,
                    } = row;

                    // console.log(format(Date.now(), 'dd/MM/yyyy'));
                    const dateAdded = format(date, 'dd/MM/yyyy');

                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, name)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{seller}</TableCell>
                        <TableCell align="left">{category}</TableCell>
                        <TableCell align="left">{dateAdded}</TableCell>
                        <TableCell align="left">{amount}</TableCell>
                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            refId={id}
                            refName={name}
                            formik={formik}
                            handleModalOpen={handleModalOpen}
                            handleModalClose={handleModalClose}
                            setSnackColor={setSnackColor}
                            setSnackMessage={setSnackMessage}
                            setSnackOpen={setSnackOpen}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {/* {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )} */}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={stockData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sell Stock
            </Typography>
            <Container sx={{ marginTop: '13px' }}>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        // fullWidth
                        label="Name"
                        disabled
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />

                      <TextField
                        fullWidth
                        disabled
                        label="Stock Id"
                        {...getFieldProps('stockId')}
                        error={Boolean(touched.stockId && errors.stockId)}
                        helperText={touched.stockId && errors.stockId}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          width: '50%',
                        }}
                      >
                        <MonetizationOnSharpIcon
                          sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                        />
                        <TextField
                          fullWidth
                          label="Amount"
                          type="number"
                          variant="standard"
                          {...getFieldProps('amount')}
                          error={Boolean(touched.amount && errors.amount)}
                          helperText={touched.amount && errors.amount}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        {...getFieldProps('quantity')}
                        error={Boolean(touched.quantity && errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Payment Mode"
                        {...getFieldProps('paymentMode')}
                        error={Boolean(
                          touched.paymentMode && errors.paymentMode
                        )}
                        helperText={touched.paymentMode && errors.paymentMode}
                      />

                      <TextField
                        fullWidth
                        label="Transaction Id"
                        {...getFieldProps('transactionId')}
                        error={Boolean(
                          touched.transactionId && errors.transactionId
                        )}
                        helperText={
                          touched.transactionId && errors.transactionId
                        }
                      />
                    </Stack>

                    <Divider />

                    <Typography gutterBottom>Customer Details :</Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Name"
                        {...getFieldProps('customerName')}
                        error={Boolean(
                          touched.customerName && errors.customerName
                        )}
                        helperText={touched.customerName && errors.customerName}
                      />
                      <TextField
                        fullWidth
                        label="Phone No"
                        {...getFieldProps('phoneNo')}
                        error={Boolean(touched.phoneNo && errors.phoneNo)}
                        helperText={touched.phoneNo && errors.phoneNo}
                      />
                    </Stack>

                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={4}
                      {...getFieldProps('address')}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                    />

                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Sell Stock
                    </LoadingButton>
                  </Stack>
                </Form>
              </FormikProvider>
            </Container>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        // key={'top'+'right'}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackColor}
          sx={{ width: '100%' }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </MainCard>
  );
};

export default Stocks;
