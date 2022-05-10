import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// // material
import {
  Grid,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  CardContent,
  Avatar,
  Box,
  Divider,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
// // components
import MainCard from '../../components/MainCard';
import Iconify from 'components/Iconify';

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';

import Cookies from 'js-cookie';

import { LoadingButton } from '@mui/lab';

import axios from 'axios';

const Profile = () => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    credentials: 'include',
  };

  const user = {
    name: 'Somaksh Sharma',
    avatar: '/static/mock-images/avatars/avatar_default.jpg',
    email: 'somakshs467@gmail.com',
    phoneNo: '9814753684',
  };

  const USER_DETAILS = JSON.parse(Cookies.get('user'));

  const [isEdit, setIsEdit] = useState(false);
  const [detailsChanged, setDetailsChanged] = useState(false);

  const [disableEmail, setDisableEmail] = useState(true);

  const navigate = useNavigate();

  const UserDetails = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    phoneNo: Yup.string().min(8, 'Too Short!').max(12, 'Too Long!'),
  });

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: USER_DETAILS.name || ' ',
      phoneNo: USER_DETAILS.phoneNo || ' ',
      email: USER_DETAILS.email || ' ',
    },
    validationSchema: UserDetails,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values));

      try {
        const response = await axios.put(
          `http://localhost:5000/api/admin/updateAdminDetails`,
          {
            data: {
              email: values.email,
              dataToUpdate: {
                name: values.fullName,
                phoneNo: values.phoneNo,
              },
            },
          },
          options
        );

        Cookies.remove('user');

        Cookies.set('user', JSON.stringify(response.data.data), { expires: 1 });

        setIsEdit(false);
        setDetailsChanged((prev) => !prev);
        window.location.reload(false);
      } catch (err) {
        alert(err.message);
      }
    },
  });

  const handleEdit = () => {
    setIsEdit(true);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/getAdminDetails/${formik.values.email}`,
          options
        );

        // console.log(data);
        // userDispatcher(addUser(data.data));

        Cookies.remove('user');
        Cookies.set('user', JSON.stringify(data.data), { expires: 1 });
      } catch (err) {
        setSnackColor('error');
        setSnackMessage('Couldnt fetch user details');
        setSnackOpen(true);
      }
    };

    fetchUserDetails().then();
  }, [detailsChanged]);

  return (
    <MainCard title="Dashboard: Profile">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Account
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="ci:edit" />}
            onClick={handleEdit}
          >
            Edit Details
          </Button>
        </Stack>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Card sx={{ minWidth: 350 }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      height: 150,
                      mb: 2,
                      width: 150,
                    }}
                  />

                  <Divider variant="middle" />

                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {user.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {user.email}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {user.phoneNo}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
            </Card>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Card sx={{ minHeight: 300, padding: 5, width: '100%' }}>
              <Typography sx={{ marginBottom: 2 }}>Admin Profile :</Typography>
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        <TextField
                          fullWidth
                          disabled={!isEdit}
                          label="Full name"
                          {...getFieldProps('fullName')}
                          error={Boolean(touched.fullName && errors.fullName)}
                          helperText={touched.fullName && errors.fullName}
                        />

                        <TextField
                          fullWidth
                          disabled={!isEdit}
                          label="Phone No"
                          {...getFieldProps('phoneNo')}
                          error={Boolean(touched.phoneNo && errors.phoneNo)}
                          helperText={touched.phoneNo && errors.phoneNo}
                        />
                      </Stack>

                      <TextField
                        fullWidth
                        disabled
                        autoComplete="username"
                        type="email"
                        label="Email address"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />

                      <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Save Details
                      </LoadingButton>
                    </Stack>
                  </Form>
                </FormikProvider>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainCard>
  );
};

export default Profile;
