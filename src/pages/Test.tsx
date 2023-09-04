import { Button } from '@mui/material';
import React from 'react';
import Alert from '../utils/Alert/Alert';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Test = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Button
        onClick={() => {
          Alert.error({ title: 'AaSsDdFf', text: 'AaSsDdFf' });
        }}
      >
        Error
      </Button>
      <Button
        onClick={() => {
          Alert.success({ title: 'Success', text: 'Success' });
        }}
      >
        Success
      </Button>
      <Button
        onClick={() => {
          Alert.confirm(() => {
            // const formData: any = new FormData();
            // // Add your form data to the formData object
            // formData.append('testArr', [1, 2, 3]);
            // formData.append('testObj', {
            //   test: 'test',
            //   abc: 'abc',
            // });

            const payload = {
              test: [1, 2, 3],
              test1: {
                test: 'test',
                abc: 'abc',
              },
            };

            const encryptionKey = 'your-encryption-key'; // Replace with your encryption key
            const encryptedPayload = CryptoJS.AES.encrypt(
              JSON.stringify(payload),
              encryptionKey
            ).toString();

            try {
              const response = axios.post(
                'http://localhost:8081',
                encryptedPayload,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data', // Important for sending FormData
                    // Add any additional headers for authentication or other purposes
                  },
                }
              );
              // Handle the response here
            } catch (error) {
              // Handle errors here
            }
          });
        }}
      >
        Confirm
      </Button>
      <Button
        onClick={() => {
          Alert.update({ title: 'auccess', text: '' });
        }}
      >
        Update
      </Button>
      <Button
        onClick={() => {
          Alert.delete({ title: 'auccess', text: '' });
        }}
      >
        Delete
      </Button>
    </div>
  );
};

export default Test;
