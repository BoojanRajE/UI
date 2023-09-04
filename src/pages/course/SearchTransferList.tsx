import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
  Button,
  AutocompleteRenderInputParams,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
// import { AddIcon, RemoveIcon } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Remove';
import axios from 'axios';

interface SearchItem {
  id: string;
  name: string;
}

const SearchTransferList = () => {
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SearchItem[]>([]);

  const handleSearch = async (searchTerm: string | any) => {
    // Send search request to server and set search results

    const searchURL = `${process.env.REACT_APP_BASE_URL}/api/users/search?email=${searchTerm.name}`;
    axios
      .get(searchURL)
      .then((result: any) => {
        // const output = result.data.records.map((e: any) => ({
        //   ...e,
        //   courseId: params.data.id,
        // }));

        const searchRes = [
          {
            id: result.data.users.id,
            name: `${result.data.users.first_name} ${result.data.users.last_name}`,
          },
        ];
        setSearchResults(searchRes);
        setSelectedItems([...searchResults, ...searchRes]);
      })
      .catch((error: any) => {});
  };

  const handleAdd = (item: SearchItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemove = (item: SearchItem) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem !== item)
    );
  };

  return (
    <Formik
      initialValues={{ search: { id: '', name: '' } }}
      onSubmit={(values) => handleSearch(values?.search)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Field
            name="search"
            as={Autocomplete}
            freeSolo
            value={values?.search}
            options={searchResults?.length > 0 ? searchResults : []}
            fullWidth
            isOptionEqualToValue={(option: any, value: any) =>
              option.id === value
            }
            // renderOption={(option: SearchItem) => option.name}
            getOptionLabel={(option: SearchItem) => option.name}
            // onChange={(_: any, name: any) => {
            //
            //   setFieldValue("search", name);
            // }}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                name="search"
                placeholder="Search Users"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setFieldValue('search', {
                    id: '',
                    name: e.target.value,
                  });
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Button type="submit" variant="contained" color="primary">
                      Search
                    </Button>
                  ),
                }}
                // value={values.search}
                required
              />
            )}
          />
          {/* <Field
            component={Autocomplete}
            freeSolo
            options={searchResults}
            value={values.search}
            // onChange={(event: React.SyntheticEvent, search: any) => {
            //   
            //   setFieldValue("search", search);
            // }}
            onChange={(_: any, name: any) => {
              
              setFieldValue("search", name);
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                label="Search"
                name="search"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Button type="submit" variant="contained" color="primary">
                      Search
                    </Button>
                  ),
                }}
              />
            )}
            // renderOption={(option: SearchItem) => option.name}
            getOptionLabel={(option: SearchItem) => option.name}
          /> */}
          <List>
            {selectedItems.map((item: SearchItem) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleRemove(item)}>
                    <RemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {/* <List>
            {searchResults.map((item: SearchItem) => (
              <ListItem key={item.id} button onClick={() => handleAdd(item)}>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleAdd(item)}>
                    <AddIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List> */}
        </Form>
      )}
    </Formik>
  );
};

export default SearchTransferList;
