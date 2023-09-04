import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import GridHeader1 from '../../utils/gridHeader/GridHeader1';
import MasterGrid from '../../utils/MasterGrid/MasterGrid';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
  AutocompleteRenderInputParams,
  Autocomplete,
  RadioGroup,
  Box,
  Grid,
  Button,
  Checkbox,
  InputAdornment,
  Menu,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Divider,
  Radio,
  FormLabel,
  FormControlLabel,
  TableHead,
  TableContainer,
  Hidden,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import {
  addAssessment,
  addAssessmentVersion,
  editAssessmentData,
  getAssessmentDiscipline,
} from '../../reduxStore/reducer/assessmentReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../reduxStore/Store';
import Editor from '../../utils/Editor/Editor';
import { createServerSideDatasource } from '../../utils/gridMethod/createServerSideDatasource';
import { GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLocation, useNavigate } from 'react-router';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import 'suneditor/src/assets/css/suneditor-contents.css';
// import 'katex/dist/katex.min.css';
import { getDisciplineDetails } from '../../reduxStore/reducer/disciplineReducer';
import { MdOutlineRadio } from 'react-icons/md';
import {
  editCoursePrefixData,
  getCoursePrefixName,
} from '../../reduxStore/reducer/coursePrefixReducer';
import { AssessmentDiscipline } from './AssessmentDiscipline';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Alert from '../../utils/Alert/Alert';

// const getAlphabetFromNumber = async (_num: any) => {
//   let str = '';

//   const multiples = Math.ceil(_num / 26);
//   const _charAtCode = _num - (multiples - 1) * 26;

//   for (let i = 0; i < multiples; i++)
//     str += String.fromCharCode(_charAtCode + 64);

//   return str;
// };
const getAlphabetFromNumber = (_num: any) => {
  let str = '';

  const multiples = Math.ceil(_num / 26);
  const _charAtCode = (_num - 1) % 26; // Corrected calculation for alphabet letter

  for (let i = 0; i < multiples; i++)
    str += String.fromCharCode(_charAtCode + 65); // Using 65 instead of 64

  return str;
};

const AssesmentQuestion = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [val, setVal] = useState<any>(
    state?.value?.question
      ? state?.value?.question
      : {
          instruction: '',
          likert: {
            type: 'question',
            questionLabel:
              state?.value?.questionType == '1,2,3'
                ? state?.value?.question?.length + 1
                : '',
            questionContent: '',
            responseType: 'Single',
            isScored: state?.value?.key == true ? 'Yes' : '',
            optionOrientation: 'Vertical',
            framing: '',
            answer: '',
            defaultAnswer: '',
            responseOptions: [],
            index: '',
          },
          data: [],
          filterQuestion: {
            filterQuestion: state?.value?.question?.filterQuestion
              ?.filterQuestion
              ? state?.value?.question?.filterQuestion?.filterQuestion
              : '',
            filterResponse: state?.value?.question?.filterQuestion
              ?.filterResponse
              ? state?.value?.question?.filterQuestion?.filterResponse
              : '',
          },
        }
  );

  //client side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef: any = useRef(1);
  const itemsPerPage = 5;
  //

  // Calculate the index range for the current page

  const startIndex = (currentPageRef.current - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items for the current page
  let currentItems =
    val?.data?.length > 0 && val?.data.slice(startIndex, endIndex);

  // useEffect(() => {
  //   currentItems =
  //     val?.data?.length > 0 && val?.data.slice(startIndex, endIndex);
  // }, [val]);

  const totalPages = Math.ceil(val.data.length / itemsPerPage);

  const [filterQuestion, setFilterQuestion] = useState({
    filterQuestion: state?.value?.question?.filterQuestion?.filterQuestion
      ? state?.value?.question?.filterQuestion?.filterQuestion
      : '',
    filterResponse: state?.value?.question?.filterQuestion?.filterResponse
      ? state?.value?.question?.filterQuestion?.filterResponse
      : '',
  });

  const [filterState, setFilterState] = useState<any>({
    filterQuestion: '',
    filterResponse: '',
  });

  const [likert, setLikert] = useState(
    state?.value?.question
      ? state?.value?.question.likert
      : {
          type: 'question',
          questionLabel:
            state?.value?.questionType == '1,2,3'
              ? state?.value?.question?.length + 1
              : '',
          questionContent: '',
          responseType: 'Single',
          isScored:
            state?.value?.key == true || state?.value?.key == 'true'
              ? 'Yes'
              : '',
          optionOrientation: 'Vertical',
          framing: '',
          answer: '',
          defaultAnswer: '',
          responseOptions: [],
          index: '',
        }
  );

  //state?.value?.question ? state?.value?.question :
  const [value, setValue] = React.useState(0);

  const handleadd = () => {
    const value: any = { ...val };
    if (state?.value?.likert == 'true' || state?.value?.likert == true) {
      value.data.push({
        ...val?.likert,
        questionLabel:
          state?.value?.questionType == '1,2,3' ? value?.data?.length + 1 : '',
        index: questionIndex,
      });
    } else {
      value.data.push({
        type: 'question',
        questionLabel:
          state?.value?.questionType == '1,2,3' ? value?.data?.length + 1 : '',
        questionContent: '',
        responseType: 'Single',
        isScored:
          state?.value?.key == 'true' || state?.value?.key == true ? 'Yes' : '',
        optionOrientation: 'Vertical',
        framing: '',
        answer: '',
        defaultAnswer: '',
        responseOptions: [],
        index: questionIndex,
      });
    }
    setVal(value);
  };

  const handleAddAfter = (index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;
    const value: any = { ...val };

    if (state?.value?.likert == 'true' || state?.value?.likert == true) {
      value.data.splice(i + 1, 0, {
        ...val?.likert,
        questionLabel:
          state?.value?.questionType == '1,2,3' ? questionIndex + 1 : '',
        index: questionIndex,
      });
    } else {
      value.data.splice(i + 1, 0, {
        type: 'question',
        questionLabel:
          state?.value?.questionType == '1,2,3' ? questionIndex + 1 : '',
        questionContent: '',
        responseType: 'Single',
        isScored: state?.value?.key == 'true' || state?.value?.key ? 'Yes' : '',
        optionOrientation: 'Vertical',
        responseOptions: [],
        answer: '',
        defaultAnswer: '',
        index: questionIndex ? questionIndex : 1,
      });
    }
    if (state?.value?.questionType == '1,2,3') {
      let questionIndex = 0;
      const mappedData = value.data.map((item: any, index: any) => {
        if (item.type == 'question') {
          questionIndex += 1;
          return { ...item, questionLabel: questionIndex };
        } else {
          return item;
        }
      });
      value.data = mappedData;
      setVal(value);
    } else {
      setVal(value);
    }
  };

  const handleOptionAdd = async (index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;
    const value: any = { ...val };

    value.data[i].responseOptions.push({
      optionLabel:
        state?.value?.optionType == '1,2,3'
          ? value.data[i].responseOptions?.length + 1
          : state?.value?.optionType == 'a,b,c'
          ? `${await getAlphabetFromNumber(
              value.data[i].responseOptions?.length + 1
            )}`
          : '',
      optionContent: '',
    });
    setVal(value);
  };

  const handledelete = (index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;
    if (currentItems.length === 1 && currentPageRef.current > 1) {
      setCurrentPage((prev) => prev - 1);
      currentPageRef.current -= 1;
    }
    setVal((prevValue: any) => {
      const updatedValue = { ...prevValue };
      updatedValue.data.splice(i, 1);

      if (state?.value?.questionType === '1,2,3') {
        let questionIndex = 0;
        const mappedData = updatedValue.data.map((item: any) => {
          if (item.type === 'question') {
            questionIndex += 1;
            return { ...item, questionLabel: questionIndex };
          } else {
            return item;
          }
        });
        updatedValue.data = mappedData;
      }

      // Update the state inside the callback function
      return { ...updatedValue };
    });
  };

  const handleAddFrame = (data: any, index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;

    setVal((prevValue: any) => {
      const value = { ...prevValue };

      const framingLength = dataFraming.length;

      value.data.splice(i + 1, 0, {
        type: 'framing',
        framingLabel: `Framing ${framingIndex + 1}`,
        framingContent: '',
      });

      let framingInd = 0;
      const mappedData = value.data.map((item: any, index: any) => {
        if (item.type == 'framing') {
          framingInd += 1;
          return {
            ...item,
            framingLabel: `Framing ${framingInd}`,
          };
        } else {
          return item;
        }
      });
      value.data = mappedData;

      return value;
    });

    // setVal(() => value);
  };

  const columnchange = (e: any, index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;
    const { name, value } = e.target;

    setVal((prevVal: any) => {
      const inputdata = { ...prevVal };

      if (name === 'isScored' && value === 'No') {
        inputdata.data[i].defaultAnswer = '';
      }

      if (
        (name === 'responseType' && value === 'Open') ||
        value === 'Number' ||
        value === 'Text'
      ) {
        if (value === 'Number') {
          inputdata.data[i].defaultAnswer = '1';
          inputdata.data[i].responseOptions = [
            { optionLabel: '1', optionContent: '1' },
          ];
        } else {
          inputdata.data[i].defaultAnswer = '';
          inputdata.data[i].responseOptions = [
            { optionLabel: '', optionContent: '' },
          ];
        }
      }

      // if (
      //   (name === 'responseType' && value === 'Single') ||
      //   (name === 'responseType' && value === 'Multiple')
      // ) {
      //   // Clear the default answer for single/multiple choice questions
      //   inputdata.data[i].defaultAnswer = '';

      //   // Renumber the options for single/multiple choice questions
      //   inputdata.data[i].responseOptions = inputdata.data[
      //     i
      //   ].responseOptions.map((option: any, index: number) => ({
      //     optionLabel:
      //       state?.value?.optionType == '1,2,3'
      //         ? (index + 1).toString()
      //         : state?.value?.optionType == 'a,b,c'
      //         ? `${getAlphabetFromNumber(index + 1)}`
      //         : '',
      //     optionContent: option.optionContent,
      //   }));
      // }
      if (
        (name === 'responseType' && value === 'Single') ||
        (name === 'responseType' && value === 'Multiple')
      ) {
        // Clear the default answer for single/multiple choice questions
        inputdata.data[i].defaultAnswer = '';

        // Renumber the options for single/multiple choice questions
        inputdata.data[i].responseOptions = inputdata.data[
          i
        ].responseOptions.map((option: any, index: number) => ({
          optionLabel:
            state?.value?.optionType === '1,2,3'
              ? (index + 1).toString()
              : state?.value?.optionType === 'a,b,c'
              ? getAlphabetFromNumber(index + 1) // Call the function to get the alphabet
              : state?.value?.optionType === 'Custom'
              ? option.optionLabel
              : '',
          optionContent: option.optionContent,
        }));
      }

      inputdata.data[i][name] = value;
      return inputdata;
    });
  };

  const columnOptionchange = (e: any, ind: any, index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + ind;
    const { name, value } = e.target;

    setVal((prevVal: any) => {
      const inputdata = { ...prevVal };
      inputdata.data[i].responseOptions[index][name] = value;

      if (
        inputdata.data[i].responseType == 'Open' ||
        inputdata.data[i].responseType == 'Number' ||
        inputdata.data[i].responseType == 'Text'
      ) {
        if (inputdata.data[i].responseType == 'Number') {
          inputdata.data[i].defaultAnswer =
            inputdata.data[i].responseOptions[index].optionLabel;
        } else {
          inputdata.data[i].defaultAnswer =
            inputdata.data[i].responseOptions[index].optionContent;
        }
      }
      return inputdata;
    });

    // const inputdata: any = { ...val };
    // inputdata.data[i].responseOptions[index][name] = value;

    // if (
    //   inputdata.data[i].responseType == 'Open' ||
    //   inputdata.data[i].responseType == 'Number' ||
    //   inputdata.data[i].responseType == 'Text'
    // ) {
    //   if (inputdata.data[i].responseType == 'Number') {
    //     inputdata.data[i].defaultAnswer =
    //       inputdata.data[i].responseOptions[index].optionLabel;
    //   } else {
    //     inputdata.data[i].defaultAnswer =
    //       inputdata.data[i].responseOptions[index].optionContent;
    //   }
    // }

    // setVal(inputdata);
  };

  const handleDeleteOpiton = (index: any, ind: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + ind;

    setVal((prevVal: any) => {
      let deleteval: any = { ...prevVal };
      deleteval.data[i].responseOptions.pop();

      if (
        val?.filterQuestion?.filterResponse >
        deleteval?.data[val?.filterQuestion?.filterQuestion - 1]
          ?.responseOptions?.length
      ) {
        deleteval.filterQuestion = filterData;
      }
      return deleteval;
    });
  };

  const moveUp = (index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;

    setVal((prevVal: any) => {
      const arr: any = { ...prevVal };
      if (
        state.value.questionType == '1,2,3' ||
        state.value.questionType == 'a,b,c'
      ) {
        const previousElement = arr.data[i - 1].questionLabel;
        const currentElement = arr.data[i].questionLabel;
        if (currentElement) {
          arr.data[i - 1].questionLabel = currentElement;
        }
        if (previousElement) {
          arr.data[i].questionLabel = previousElement;
        }
      }

      if (arr?.data[i].type === 'framing') {
        const previousElement = arr.data[i - 1].framingLabel;
        const currentElement = arr.data[i].framingLabel;
        if (currentElement) {
          arr.data[i - 1].framingLabel = currentElement;
        }
        if (previousElement) {
          arr.data[i].framingLabel = previousElement;
        }
      }

      const element = arr.data[i];
      arr.data.splice(i, 1);
      arr.data.splice(i - 1, 0, element);

      return arr;
    });
  };

  const moveDown = (index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;

    setVal((prevVal: any) => {
      let arr: any = { ...prevVal };

      if (
        state.value.questionType == '1,2,3' ||
        state.value.questionType == 'a,b,c'
      ) {
        const previousElement = arr.data[i + 1].questionLabel;
        const currentElement = arr.data[i].questionLabel;
        if (currentElement) {
          arr.data[i + 1].questionLabel = currentElement;
        }
        if (previousElement) {
          arr.data[i].questionLabel = previousElement;
        }
      }

      if (arr?.data[i].type === 'framing') {
        const previousElement = arr.data[i + 1].framingLabel;
        const currentElement = arr.data[i].framingLabel;
        if (currentElement) {
          arr.data[i + 1].framingLabel = currentElement;
        }
        if (previousElement) {
          arr.data[i].framingLabel = previousElement;
        }
      }

      const element = arr.data[i];
      arr.data.splice(i, 1);
      arr.data.splice(i + 1, 0, element);
      return arr;
    });
  };

  const [Instruction, setInstruction] = useState(
    val?.instruction.replace(/<\/?p>/g, '').replace(/<br\s?\/?>/g, '') == ''
      ? false
      : true
  );

  const validation = Yup.object({
    discipline: Yup.object({
      id: Yup.string().required('Required Field'),
      name: Yup.string().required('Required Field'),
    }).required('Required Field'),
    officialAssessmentName: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    publicAssessmentName: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    assessmentCode: Yup.string()
      .matches(
        /^[a-zA-z]/,
        'starting letter should not be a space, numbers or special characters'
      )
      .required('Required Field'),
    questionType: Yup.string().required('Required Field'),
    optionType: Yup.string().required('Required Field'),
    key: Yup.string().required('Required Field'),
    likert: Yup.string().required('Required Field'),
    minimum_duration: Yup.number().required('Required Field'),
  });

  useEffect(() => {
    dispatch(getAssessmentDiscipline());
  }, [dispatch, state]);

  const disciplineData: { id: string; name: string }[] = useSelector(
    (state: RootState) => {
      const data = state.assessment.assessmentDiscipline;

      const alterData: any = [...data];
      alterData.unshift({
        id: '',
        name: 'ADD NEW DISCIPLINE',
      });
      return alterData;
    }
  );

  const [initialValues, setInitialValue] = useState<any>(state?.value);

  const handleRadioChange = (e: any, index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;

    setVal((prevVal: any) => {
      const value: any = { ...prevVal };
      value.data[i].defaultAnswer = e.target.value;
      return value;
    });
  };

  const onCheckboxChange = (e: any, index: any) => {
    const i = (currentPageRef.current - 1) * itemsPerPage + index;

    setVal((prevVal: any) => {
      const value: any = { ...prevVal };
      const { name, checked } = e.target;

      const data = {
        ...value?.data[i]?.defaultAnswer,
        [name]: checked,
      };
      value.data[i].defaultAnswer = data;
      return value;
    });
  };

  const [openForm, setOpenForm] = useState<any>(false);
  const [filterOpen, setFilterOpen] = useState<any>(false);
  const [publish, setPublish] = useState(false);

  const [open, setOpen] = useState(false);
  const handleClickClose = () => {
    setOpen(false);
  };

  const dataFraming = val.data.filter((d: any, i: any) => d.type === 'framing');

  let questionIndex = 0;
  let framingIndex = 0;

  const regex = /<img.*?\>/;
  const arr: any = [];
  // const imageAlternateData =
  //   val?.data > 0
  //     ? val?.data?.filter((d: any) => {
  //         if (
  //           d?.questionContent?.match(regex)[0] ||
  //           d?.framingContent?.match(regex)[0]
  //         ) {
  //           arr.push(d);
  //         }
  //       })
  //     : [];

  // const imageData = val?.data?.map((d: any) => {
  //   if (
  //     (d?.questionContent &&
  //       (d?.questionContent?.match(regex) !== null
  //         ? d?.questionContent?.match(regex)[0]
  //         : false)) ||
  //     (d?.framingContent && d?.framingContent?.match(regex) !== null
  //       ? d?.framingContent?.match(regex)[0]
  //       : false)
  //   ) {
  //     if (d?.questionContent) {
  //       arr.push(d?.questionContent);
  //     }
  //     if (d?.framingContent) {
  //       arr.push(d?.framingContent);
  //     }
  //   }
  // });

  const imageAlternateData = arr?.map((d: any) => {
    const reg: any = /alt="(.*?)"/;
    const altText = reg.exec(d)[1];
    return { image: d, alt: altText ? altText : '' };
  });

  const filterData = val?.data?.filter((d: any) => d.type === 'question');

  const [button, setButton] = useState(false);

  //likert
  const [likertOpen, setLikertOpen] = useState(
    state?.value?.likert == 'true' || state?.value?.likert == true
      ? true
      : false
  );

  // const [likert, setLikert] = useState({
  //   type: 'question',
  //   questionLabel:
  //     state?.value?.questionType == '1,2,3' ? val?.data?.length + 1 : '',
  //   questionContent: '',
  //   responseType: 'Single',
  //   isScored: state?.value?.key == true ? 'Yes' : '',
  //   optionOrientation: 'Vertical',
  //   framing: '',
  //   answer: '',
  //   defaultAnswer: '',
  //   responseOptions: [],
  //   index: '',
  // });

  const handleOptionAddLikert = async () => {
    const data: any = JSON.parse(JSON.stringify(likert));
    // const overallData: any = { ...val };
    data.responseOptions.push({
      optionLabel:
        state?.value?.optionType == '1,2,3'
          ? data.responseOptions?.length + 1
          : state?.value?.optionType == 'a,b,c'
          ? `${await getAlphabetFromNumber(data.responseOptions?.length + 1)}`
          : '',
      optionContent: '',
    });
    // overallData.likert = data;

    setLikert(data);
  };

  const handleLikertChange = (e: any) => {
    const { name, value } = e.target;
    const inputdata: any = JSON.parse(JSON.stringify(likert));
    inputdata[name] = value;
    // inputdata.data[i].responseOptions[index][name] = value;
    setLikert(inputdata);
    // setLikert(inputdata);
  };

  const handleLikertOptionChange = (e: any, i: any) => {
    const { name, value } = e.target;
    // const inputdata: any = { ...likert };
    // inputdata.responseOptions[i][name] = value;
    setLikert((likert: any) => {
      const inputdata: any = JSON.parse(JSON.stringify(likert));
      inputdata.responseOptions[i][name] = value;
      return inputdata;
    });
  };

  const handleDeleteOpitonLikert = () => {
    let data: any = JSON.parse(JSON.stringify(likert));
    data.responseOptions.pop();
    setLikert(data);
  };

  const [error, setError] = useState<any>([]);
  // const [errorCondition, setErrorCondition] = useState<any>(false);

  // const total = Math.ceil(data.length / itemsPerPage);

  // Handle next button click
  const handleNextClick = () => {
    currentPageRef.current += 1;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handle ba button click
  const handleBackClick = () => {
    currentPageRef.current -= 1;
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <Grid item xs={12}>
        <Grid container justifyContent="space-evenly">
          <Grid
            item
            sx={{
              width: 200,
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validation}
              onSubmit={async (values) => {
                setValue(1);
                values.question = val;
                values.question_id = state?.value?.question_id;

                let isAllFalse = false;

                if (state.version) {
                  isAllFalse = true;
                }

                if (filterData.length > 0) {
                  if (state.version) {
                    values.is_published = true;

                    const errorMap = val?.data.map((d: any, i: any) => {
                      let structure: any = {
                        questionContent: false,
                        questionLabel: false,
                        responseOptions: [],
                        responseOption: false,
                        answer: false,
                      };

                      if (d.type == 'question') {
                        if (
                          d.questionContent
                            .replace(/<p>(.*?)<\/p>/, (_: any, content: any) =>
                              content.replace(/&nbsp;/g, '')
                            )
                            .trim() == ''
                        ) {
                          structure.questionContent = true;
                        }
                        // else if(){

                        // }

                        if (d.questionLabel == '') {
                          structure.questionLabel = true;
                        }

                        // if (
                        //   d.responseType == 'Open' || d.responseType == 'Text'
                        // ) {
                        //   if (d.defaultAnswer == '') {
                        //     structure.answer = true;
                        //   }
                        // }

                        if (
                          d.defaultAnswer == '' &&
                          d.responseType !== 'Multiple'
                        ) {
                          if (
                            state?.value?.key == 'true' ||
                            state?.value?.key == true
                          ) {
                            if (d?.isScored !== 'No') {
                              structure.answer = true;
                            }
                          }
                        }

                        if (d.responseType == 'Multiple') {
                          if (
                            state?.value?.key == 'true' ||
                            state?.value?.key == true
                          ) {
                            if (
                              Object.entries(d?.defaultAnswer)
                                .map(([key, value]) => {
                                  if (value) return key || '';
                                })
                                .filter((i) => i).length == 0
                            ) {
                              if (d?.isScored !== 'No') {
                                structure.answer = true;
                              }
                            } else {
                              structure.answer = false;
                            }
                          }
                        }

                        if (d.responseOptions.length > 0) {
                          d.responseOptions.map((data: any) => {
                            if (
                              d.responseType === 'Open' ||
                              d.responseType === 'Text'
                            ) {
                              structure.responseOptions.push({
                                optionLabel: false,
                                optionContent:
                                  typeof data.optionContent === 'string' &&
                                  data.optionContent
                                    .replace(/<\/?p>/g, '')
                                    .replace(/<br\s?\/?>/g, '') === '' // Check if option content is an empty string after replacements
                                    ? true
                                    : false,
                              });
                            } else {
                              structure.responseOptions.push({
                                optionLabel:
                                  data.optionLabel === '' ? true : false,
                                optionContent:
                                  typeof data.optionContent === 'string' &&
                                  data.optionContent
                                    .replace(/<\/?p>/g, '')
                                    .replace(/<br\s?\/?>/g, '') === '' // Check if option content is an empty string after replacements
                                    ? true
                                    : false,
                              });
                            }
                          });
                        } else {
                          structure.responseOption = true;
                        }
                      } else {
                        structure = {};
                      }
                      return structure;
                    });
                    const error = await Promise.all(errorMap);

                    for (let i = 0; i < error.length; i++) {
                      const obj = error[i];

                      if (Object.keys(obj).length === 0) {
                        continue; // skip empty object
                      }

                      if (obj.questionContent !== false) {
                        isAllFalse = false;
                        break;
                      }

                      if (obj.questionLabel !== false) {
                        isAllFalse = false;
                        break;
                      }

                      if (obj.answer !== false) {
                        isAllFalse = false;
                        break;
                      }

                      if (obj.responseOption !== false) {
                        isAllFalse = false;
                        break;
                      }

                      // if (obj.responseOptions.length === ) {
                      for (let j = 0; j < obj.responseOptions.length; j++) {
                        const option = obj.responseOptions[j];

                        if (option.optionContent !== false) {
                          isAllFalse = false;
                          break;
                        }

                        if (option.optionLabel !== false) {
                          isAllFalse = false;
                          break;
                        }
                      }
                      // } else {
                      //   Alert.info({
                      //     title: 'Fleez',
                      //     text: '',
                      //   });
                      //   isAllFalse = false;
                      //   break;
                      // }
                    }

                    setError(() => {
                      return error;
                    });

                    if (
                      (isAllFalse && state?.value?.filter === 'true') ||
                      state?.value?.filter === true
                    ) {
                      if (
                        state?.value.key == true ||
                        state?.value.key == 'true'
                      ) {
                        if (val?.filterQuestion?.filterQuestion == '') {
                          isAllFalse = false;
                          Alert.info({
                            title: 'Please add filter question',
                            text: '',
                          }).then(() => {
                            setFilterOpen(true);
                          });
                          return;
                        }
                      } else {
                        if (
                          val?.filterQuestion?.filterQuestion == '' ||
                          val?.filterQuestion?.filterResponse == ''
                        ) {
                          isAllFalse = false;
                          Alert.info({
                            title: 'Please add filter question',
                            text: '',
                          }).then(() => {
                            setFilterOpen(true);
                          });
                          return;
                        }
                      }
                    }
                  } else {
                    values.is_published = false;
                    if (state.action === 'Create') {
                      setButton(true);
                      dispatch(
                        addAssessment(values, '', '', navigate, setButton)
                      );
                    }
                    if (state.action === 'Update') {
                      setButton(true);
                      dispatch(
                        editAssessmentData(values, '', '', navigate, setButton)
                      );
                    }
                    if (state.action === 'Version') {
                      setButton(true);
                      dispatch(addAssessmentVersion(values, '', '', navigate));
                    }
                  }
                } else {
                  Alert.info({
                    title:
                      'Assessment questions is required to create a assessment',
                    text: '',
                  });
                }

                // isAllFalse =
                //   error?.some((x: any) => {
                //     const {
                //       questionContent = false,
                //       questionLabel = false,
                //       responseOptions = [],
                //       answer = false,
                //     } = x || {};

                //     return (
                //       !questionContent ||
                //       !questionLabel ||
                //       !answer ||
                //       responseOptions?.some((y: any) => {
                //         const { optionLabel = false, optionContent = false } =
                //           y || {};
                //         return !optionLabel || !optionContent;
                //       })
                //     );
                //   }) || false;

                if (filterData.length > 0) {
                  if (isAllFalse) {
                    if (state.action === 'Create') {
                      setButton(true);
                      dispatch(
                        addAssessment(values, '', '', navigate, setButton)
                      );
                    }
                    if (state.action === 'Update') {
                      setButton(true);
                      dispatch(
                        editAssessmentData(values, '', '', navigate, setButton)
                      );
                    }
                    if (state.action === 'Version') {
                      setButton(true);
                      dispatch(addAssessmentVersion(values, '', '', navigate));
                    }
                  } else {
                    if (state.version) {
                      Alert.info({
                        title: 'Please fill all the required fields',
                        text: '',
                      });
                    }
                  }
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                isValid,
                setFieldValue,
                setFieldTouched,
              }) => (
                <Form>
                  <Grid container spacing={2} style={{ marginTop: '20px' }}>
                    <Grid item xs={12} sm={12}>
                      <Field
                        name="discipline"
                        as={Autocomplete}
                        className="max-w-xs"
                        value={values.discipline}
                        size="small"
                        options={disciplineData}
                        getOptionLabel={(option: any) => option?.name}
                        isOptionEqualToValue={(option: any, current: any) =>
                          option.id === current.id
                        }
                        onChange={(
                          event: React.SyntheticEvent,
                          discipline: any
                        ) => {
                          if (discipline?.name == 'ADD NEW DISCIPLINE') {
                            setOpenForm(true);
                            setInitialValue({ initialValues, discipline: '' });
                          } else {
                            setFieldValue('discipline', discipline);
                          }
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            label="Discipline"
                            variant="standard"
                            placeholder="Select"
                            error={
                              errors.discipline_id && touched.discipline_id
                                ? true
                                : false
                            }
                            helperText={
                              errors.discipline && touched.discipline
                                ? errors.discipline
                                : ''
                            }
                            required
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Field
                        value={values.officialAssessmentName}
                        as={TextField}
                        label="Official Assessment Name:"
                        variant="standard"
                        required
                        name="officialAssessmentName"
                        // value={values.officialAssessmentName}
                        helperText={
                          errors.officialAssessmentName &&
                          touched.officialAssessmentName
                            ? errors.officialAssessmentName
                            : ''
                        }
                        fullWidth
                        error={
                          errors.officialAssessmentName &&
                          touched.officialAssessmentName
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        value={values.publicAssessmentName}
                        variant="standard"
                        as={TextField}
                        label="Public View Assessment Name:"
                        required
                        name="publicAssessmentName"
                        helperText={
                          errors.publicAssessmentName &&
                          touched.publicAssessmentName
                            ? errors.publicAssessmentName
                            : ''
                        }
                        fullWidth
                        error={
                          errors.publicAssessmentName &&
                          touched.publicAssessmentName
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        variant="standard"
                        as={TextField}
                        label="Assessment Code:"
                        required
                        name="assessmentCode"
                        helperText={
                          errors.assessmentCode && touched.assessmentCode
                            ? errors.assessmentCode
                            : ''
                        }
                        fullWidth
                        error={errors.assessmentCode && touched.assessmentCode}
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Field
                        variant="standard"
                        as={TextField}
                        label="Minimum Duration(In Minutes):"
                        required
                        name="minimum_duration"
                        value={values.minimum_duration}
                        helperText={
                          errors.minimum_duration && touched.minimum_duration
                            ? errors.minimum_duration
                            : ''
                        }
                        fullWidth
                        error={
                          errors.minimum_duration && touched.minimum_duration
                        }
                        sx={{ marginBottom: '15px' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Question Label Type:
                        </InputLabel>
                        <Field
                          disabled
                          id="demo-simple-select-standard"
                          as={Select}
                          name="questionType"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="Custom">Custom</MenuItem>
                          <MenuItem value="1,2,3">1,2,3</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="questionType"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Option Label Type:
                        </InputLabel>
                        <Field
                          disabled
                          id="demo-simple-select-standard"
                          as={Select}
                          name="optionType"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="Custom">Custom</MenuItem>
                          <MenuItem value="a,b,c">a,b,c</MenuItem>
                          <MenuItem value="1,2,3">1,2,3</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="optionType"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Assessment uses key?:
                        </InputLabel>
                        <Field
                          disabled
                          id="demo-simple-select-standard"
                          as={Select}
                          name="key"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="key"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Is Likert?:
                        </InputLabel>
                        <Field
                          disabled
                          id="demo-simple-select-standard"
                          as={Select}
                          name="likert"
                          labelId="demo-simple-select-standard-label"
                          defaultValue="false"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="likert"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="standard" sx={{ my: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          Uses filter question ?:
                        </InputLabel>
                        <Field
                          disabled
                          id="demo-simple-select-standard"
                          as={Select}
                          name="filter"
                          labelId="demo-simple-select-standard-label"
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Field>
                        <ErrorMessage
                          name="likert"
                          component="span"
                          className="text-red-600 ml-2 text-sm"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <div className="flex gap-3 justify-end">
                        <Button
                          sx={{
                            fontSize: '12px',
                            height: '29px',
                            alignSelf: 'center',
                          }}
                          size="small"
                          variant="contained"
                          // fullWidth
                          onClick={() => navigate('/assessment')}
                          style={{ textTransform: 'capitalize' }}
                        >
                          Close
                        </Button>
                        <Button
                          size="small"
                          sx={{
                            fontSize: '12px',
                            height: '29px',
                            alignSelf: 'center',
                          }}
                          variant="contained"
                          type="submit"
                          onClick={() => {
                            state.version = false;
                          }}
                          // fullWidth
                          disabled={!isValid || button}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {state?.action == 'Version'
                            ? 'Update'
                            : state?.action}
                        </Button>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          fontSize: '12px',
                          height: '29px',
                          alignSelf: 'center',
                          marginLeft: '13px',
                        }}
                        onClick={() => {
                          setOpen(true);
                        }}
                        style={{ textTransform: 'capitalize' }}
                        disabled={imageAlternateData.length <= 0}
                      >
                        View Image Alternative
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          fontSize: '12px',
                          height: '29px',
                          alignSelf: 'center',
                          marginLeft: '13px',
                        }}
                        onClick={() => {
                          setFilterOpen(true);
                          // setFilterState(state?.value?.filterQuestion);
                        }}
                        style={
                          state?.value?.filter == 'true' ||
                          state?.value?.filter == true
                            ? { textTransform: 'capitalize' }
                            : { display: 'none' }
                        }
                        // disabled={
                        //   state?.value?.filter == 'true' ||
                        //   state?.value?.filter == true
                        //     ? false
                        //     : true
                        // }
                      >
                        Filter Option
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button
                        size="small"
                        sx={{
                          fontSize: '12px',
                          height: '40px',
                          alignSelf: 'center',
                          marginLeft: '13px',
                        }}
                        variant="contained"
                        onClick={() => {
                          state.version = true;
                        }}
                        type="submit"
                        // fullWidth
                        disabled={!isValid || button}
                        style={{ textTransform: 'none' }}
                      >
                        Save and Publish Assessment
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button
                        size="small"
                        sx={{
                          fontSize: '12px',
                          height: '29px',
                          alignSelf: 'center',
                          marginLeft: '13px',
                        }}
                        variant="contained"
                        onClick={() => setLikertOpen(true)}
                        // fullWidth
                        // disabled={!isValid || button}
                        style={
                          state?.value?.likert == 'true' ||
                          state?.value?.likert == true
                            ? { textTransform: 'none' }
                            : { display: 'none' }
                        }
                      >
                        Edit Likert Response Options
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid
            container
            item
            xs={8}
            md={8}
            style={{ display: 'flex', height: '250px' }}
          >
            <Grid
              xs={4}
              md={4}
              style={{
                display: 'flex',
                height: '80px',
                marginTop: '50px',
                justifyContent: 'start',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (Instruction) {
                    setVal((prevVal: any) => ({ ...prevVal, instruction: '' }));
                    setInstruction(false);
                  } else {
                    setInstruction(true);
                  }
                }}
              >
                {Instruction ? 'Remove Instruction' : 'Add Instruction'}
              </Button>
            </Grid>
            <Grid
              item
              xs={8}
              md={8}
              style={
                !Instruction
                  ? { visibility: 'hidden' }
                  : {
                      display: 'flex',
                      marginTop: '50px',
                      justifyContent: 'start',
                      alignItems: 'center',
                    }
              }
            >
              <SunEditor
                setContents={val?.instruction}
                height="10"
                width="300"
                name="instruction"
                autoFocus={false}
                placeholder="Instruction"
                onChange={(e: any) => {
                  setVal((prevVal: any) => ({ ...prevVal, instruction: e }));
                }}
                setDefaultStyle={'height: auto;'}
                setOptions={{
                  katex: katex,
                  mode: 'inline',
                  buttonList: [
                    [
                      'undo',
                      'redo',
                      'font',
                      'fontSize',
                      'formatBlock',
                      'blockquote',
                      'bold',
                      'underline',
                      'italic',
                      'strike',
                      'subscript',
                      'superscript',
                      'fontColor',
                      'hiliteColor',
                      'textStyle',
                      'removeFormat',
                      'outdent',
                      'indent',
                      'align',
                      'horizontalRule',
                      'list',
                      'lineHeight',
                      'fullScreen',
                      'showBlocks',
                      'codeView',
                      'preview',
                      'print',
                      'link',
                      'horizontalRule',
                      'math',
                      'table',
                      'image',
                    ],
                  ],
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={handleadd}
                style={val.data?.length ? { display: 'none' } : {}}
              >
                Add Question
              </Button>
            </Grid>
            {val?.data &&
              currentItems?.length > 0 &&
              currentItems?.map((data: any, i: any) => {
                // i = startIndex + i;
                // i = i + currentPage * itemsPerPage;
                if (data.type === 'question') {
                  questionIndex =
                    questionIndex +
                    (currentPageRef.current - 1) * itemsPerPage +
                    1;
                  return (
                    <>
                      <Grid container>
                        <Grid item xs={8}>
                          <Grid xs={12} md={12}>
                            <Grid xs={12} md={12} style={{ display: 'flex' }}>
                              <Grid xs={6} md={6}>
                                <Tooltip
                                  title="Question Label:"
                                  placement="top"
                                >
                                  <TextField
                                    disabled={
                                      state?.value?.questionType == 'Custom'
                                        ? false
                                        : true
                                    }
                                    size="small"
                                    label="Question Label:"
                                    name="questionLabel"
                                    onChange={(e) => {
                                      columnchange(e, i);
                                    }}
                                    value={data.questionLabel}
                                    type="text"
                                    style={{ width: '100px' }}
                                    inputProps={{ maxLength: 3 }}
                                    error={
                                      error?.[
                                        (currentPageRef.current - 1) *
                                          itemsPerPage +
                                          i
                                      ]?.questionLabel
                                    }
                                  />
                                </Tooltip>
                              </Grid>
                              <Grid xs={6} md={6}>
                                <Tooltip
                                  title="Attach to Question Set Framing :"
                                  placement="top"
                                >
                                  <FormControl
                                    sx={{ minWidth: 120 }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-select-small">
                                      Attach to Question Set Framing :
                                    </InputLabel>
                                    <Select
                                      labelId="demo-select-small"
                                      id="demo-select-small"
                                      value={data?.framing}
                                      name="framing"
                                      label="Attach to Question Set Framing :"
                                      onChange={(e) => columnchange(e, i)}
                                    >
                                      {val?.data.map(
                                        (data: any, index: any) => {
                                          if (data.type === 'framing') {
                                            return (
                                              <MenuItem
                                                value={data?.framingLabel}
                                              >
                                                {data?.framingLabel}
                                              </MenuItem>
                                            );
                                          }
                                        }
                                      )}
                                    </Select>
                                  </FormControl>
                                </Tooltip>
                              </Grid>
                            </Grid>
                            <Grid
                              style={{
                                marginTop: '10px',
                                marginBottom: '10px',
                              }}
                              xs={12}
                              md={12}
                            >
                              <label style={{ fontSize: '12px' }}>
                                Question Content:
                              </label>
                              <SunEditor
                                // setContents="My contents"
                                setContents={data?.questionContent}
                                // height="10"
                                // width="400"
                                name="questionContent"
                                autoFocus={false}
                                onChange={(e: any) => {
                                  columnchange(
                                    {
                                      target: {
                                        name: 'questionContent',
                                        value: e,
                                      },
                                    },
                                    i
                                  );
                                }}
                                // error={error?.[i]?.questionLabel}
                                setDefaultStyle={
                                  error?.[
                                    (currentPageRef.current - 1) *
                                      itemsPerPage +
                                      i
                                  ]?.questionContent
                                    ? 'height: auto; border : 1px solid red;'
                                    : 'height: auto;'
                                }
                                setOptions={{
                                  katex: katex,
                                  mode:
                                    state?.value?.likert == 'true' ||
                                    state?.value?.likert == true
                                      ? 'balloon'
                                      : 'inline',
                                  buttonList: [
                                    [
                                      'undo',
                                      'redo',
                                      'font',
                                      'fontSize',
                                      'formatBlock',
                                      'blockquote',
                                      'bold',
                                      'underline',
                                      'italic',
                                      'strike',
                                      'subscript',
                                      'superscript',
                                      'fontColor',
                                      'hiliteColor',
                                      'textStyle',
                                      'removeFormat',
                                      'outdent',
                                      'indent',
                                      'align',
                                      'horizontalRule',
                                      'list',
                                      'lineHeight',
                                      'fullScreen',
                                      'showBlocks',
                                      'codeView',
                                      'preview',
                                      'print',
                                      'link',
                                      'horizontalRule',
                                      'math',
                                      'table',
                                      'image',
                                    ],
                                  ],
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                          >
                            <FormControl sx={{ minWidth: 120 }} size="small">
                              <InputLabel id="demo-select-small">
                                Response Type:
                              </InputLabel>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={data.responseType}
                                name="responseType"
                                label="Response Type:"
                                onChange={(e) => columnchange(e, i)}
                                defaultValue="Single"
                                disabled={
                                  state?.value?.likert == 'true' ||
                                  state?.value?.likert == true
                                }
                              >
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="Multiple">Multiple</MenuItem>
                                <MenuItem value="Number">Number</MenuItem>
                                <MenuItem value="Text">Text</MenuItem>
                                <MenuItem value="Open">Open</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            style={
                              state?.value?.key == 'true' ||
                              state?.value?.key == true
                                ? { marginTop: '10px', marginBottom: '10px' }
                                : { display: 'none' }
                            }
                          >
                            <FormControl sx={{ minWidth: 120 }} size="small">
                              <InputLabel id="demo-select-small">
                                is Scored:
                              </InputLabel>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={data.isScored}
                                name="isScored"
                                label="Is Scored:"
                                onChange={(e) => columnchange(e, i)}
                                disabled={
                                  state?.value?.likert == 'true' ||
                                  state?.value?.likert == true
                                }
                              >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            style={
                              data?.responseType == 'Single' ||
                              data?.responseType == 'Multiple'
                                ? { marginTop: '10px', marginBottom: '10px' }
                                : { display: 'none' }
                            }
                            // style={{ marginTop: '10px', marginBottom: '10px' }}
                          >
                            <FormControl sx={{ minWidth: 120 }} size="small">
                              <InputLabel id="demo-select-small">
                                Options Orientation:
                              </InputLabel>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={data?.optionOrientation}
                                name="optionOrientation"
                                label="Options Orientation:"
                                onChange={(e) => columnchange(e, i)}
                                defaultValue="Vertical"
                                disabled={
                                  state?.value?.likert == 'true' ||
                                  state?.value?.likert == true
                                }
                              >
                                <MenuItem value="Vertical">Vertical</MenuItem>
                                <MenuItem value="Horizontal">
                                  Horizontal
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {data?.responseType == 'Single' ||
                          data?.responseType == 'Multiple' ? (
                            <Grid
                              item
                              xs={5}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              {error?.[
                                (currentPageRef.current - 1) * itemsPerPage + i
                              ]?.answer ? (
                                <div
                                  style={{
                                    color: 'red',
                                    fontSize: '14px',
                                    marginTop: '15px',
                                  }}
                                >
                                  Please select answer
                                </div>
                              ) : (
                                ''
                              )}
                            </Grid>
                          ) : (
                            ''
                          )}

                          {data?.responseOptions?.map((d: any, index: any) => {
                            if (
                              data?.responseType == 'Single' ||
                              data?.responseType == 'Multiple'
                            ) {
                              return (
                                <Grid
                                  container
                                  xs={12}
                                  md={12}
                                  style={{
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                  }}
                                  // style={{
                                  //   display: 'flex',
                                  //   justifyContent: 'space-between',
                                  //   alignItems: 'center',
                                  //   marginTop: '20px',
                                  // }}
                                >
                                  <Grid
                                    item
                                    xs={6}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '20px',
                                      // justifyContent: 'center',
                                    }}
                                  >
                                    {data?.responseType == 'Multiple' &&
                                    (state?.value?.key == 'true' ||
                                      state?.value?.key == true) ? (
                                      <div>
                                        <Checkbox
                                          // style={{ marginRight: '20px' }}
                                          // value="Another Hispanic/Latinx/Spanish origin:"
                                          size="small"
                                          name={index + 1}
                                          checked={
                                            data?.defaultAnswer[index + 1] ||
                                            false
                                          }
                                          disabled={
                                            data?.isScored == 'No' || false
                                          }
                                          onChange={(e) =>
                                            onCheckboxChange(e, i)
                                          }
                                        />
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                    {data?.responseType == 'Single' &&
                                    (state?.value?.key === 'true' ||
                                      state?.value?.key === true) ? (
                                      <div>
                                        <Radio
                                          // color={
                                          //   error?.[i]?.answer
                                          //     ? 'error'
                                          //     : 'primary'
                                          // }
                                          // style={{ marginRight: '20px' }}
                                          checked={
                                            JSON.stringify(index + 1) ==
                                            data?.defaultAnswer
                                          }
                                          disabled={
                                            data?.isScored == 'No' || false
                                          }
                                          // checked={selectedValue === 'a'}
                                          onChange={(e: any) =>
                                            handleRadioChange(e, i)
                                          }
                                          value={JSON.stringify(index + 1)}
                                          name="radio-buttons"
                                        />
                                      </div>
                                    ) : (
                                      ''
                                    )}

                                    <Tooltip
                                      title="Option Label: "
                                      placement="top"
                                    >
                                      <TextField
                                        error={
                                          error?.[
                                            (currentPageRef.current - 1) *
                                              itemsPerPage +
                                              i
                                          ]?.responseOptions?.[index]
                                            ?.optionLabel
                                        }
                                        InputProps={{
                                          readOnly:
                                            state?.value?.optionType !==
                                              'Custom' ||
                                            state?.value?.likert == 'true' ||
                                            state?.value?.likert == true
                                              ? true
                                              : false,
                                        }}
                                        style={{
                                          width: '60px',
                                          display: 'flex',
                                          justifyContent: 'center',
                                        }}
                                        size="small"
                                        name="optionLabel"
                                        onChange={(e) =>
                                          columnOptionchange(e, i, index)
                                        }
                                        value={d.optionLabel}
                                        type="text"
                                      />
                                    </Tooltip>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <label style={{ fontSize: '12px' }}>
                                      Option Content:
                                    </label>
                                    <SunEditor
                                      // defaultValue={data.optionContent}
                                      setContents={d?.optionContent}
                                      // defaultValue={data?.optionContent}
                                      // showToolbar={false}
                                      disable={
                                        state?.value?.likert == 'true' ||
                                        state?.value?.likert == true
                                      }
                                      name="optionContent"
                                      autoFocus={false}
                                      onChange={(e: any) => {
                                        columnOptionchange(
                                          {
                                            target: {
                                              name: 'optionContent',
                                              value: e,
                                            },
                                          },
                                          i,
                                          index
                                        );
                                      }}
                                      setDefaultStyle={
                                        error?.[
                                          (currentPageRef.current - 1) *
                                            itemsPerPage +
                                            i
                                        ]?.responseOptions?.[index]
                                          ?.optionContent
                                          ? 'height: auto; border : 1px solid red;'
                                          : 'height: auto'
                                      }
                                      setOptions={{
                                        katex: katex,
                                        mode:
                                          state?.value?.likert == 'true' ||
                                          state?.value?.likert == true
                                            ? 'balloon'
                                            : 'inline',
                                        buttonList: [
                                          [
                                            'undo',
                                            'redo',
                                            'font',
                                            'fontSize',
                                            'formatBlock',
                                            'blockquote',
                                            'bold',
                                            'underline',
                                            'italic',
                                            'strike',
                                            'subscript',
                                            'superscript',
                                            'fontColor',
                                            'hiliteColor',
                                            'textStyle',
                                            'removeFormat',
                                            'outdent',
                                            'indent',
                                            'align',
                                            'horizontalRule',
                                            'list',
                                            'lineHeight',
                                            'fullScreen',
                                            'showBlocks',
                                            'codeView',
                                            'preview',
                                            'print',
                                            'link',
                                            'horizontalRule',
                                            'math',
                                            'table',
                                            'image',
                                          ],
                                        ],
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              );
                            }
                            if (data?.responseType == 'Open') {
                              return (
                                <Grid
                                  xs={12}
                                  md={12}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                  }}
                                >
                                  <TextField
                                    error={
                                      error?.[
                                        (currentPageRef.current - 1) *
                                          itemsPerPage +
                                          i
                                      ]?.responseOptions?.[index]?.optionContent
                                    }
                                    fullWidth
                                    multiline
                                    name="optionContent"
                                    label="Response Input:"
                                    value={d?.optionContent}
                                    onChange={(e) =>
                                      columnOptionchange(e, i, index)
                                    }
                                  />
                                </Grid>
                              );
                            }
                            if (data?.responseType == 'Number') {
                              return (
                                <Grid
                                  xs={12}
                                  md={12}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                  }}
                                >
                                  <TextField
                                    error={
                                      error?.[
                                        (currentPageRef.current - 1) *
                                          itemsPerPage +
                                          i
                                      ]?.responseOptions?.[index]?.optionContent
                                    }
                                    size="small"
                                    label="Correct Response:"
                                    name="optionLabel"
                                    value={Number(d?.optionLabel)}
                                    onChange={(e) =>
                                      columnOptionchange(e, i, index)
                                    }
                                    type="number"
                                  />
                                  <TextField
                                    error={
                                      error?.[
                                        (currentPageRef.current - 1) *
                                          itemsPerPage +
                                          i
                                      ]?.responseOptions?.[index]?.optionContent
                                    }
                                    size="small"
                                    label="Allowed Error (+/-):"
                                    name="optionContent"
                                    value={Number(d?.optionContent)}
                                    onChange={(e) =>
                                      columnOptionchange(e, i, index)
                                    }
                                    // value={data.optionContent}
                                    type="number"
                                  />
                                </Grid>
                              );
                            }
                            if (data?.responseType == 'Text') {
                              return (
                                <Grid
                                  xs={12}
                                  md={12}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '20px',
                                    marginBottom: '20px',
                                  }}
                                >
                                  <TextField
                                    error={
                                      error?.[
                                        (currentPageRef.current - 1) *
                                          itemsPerPage +
                                          i
                                      ]?.responseOptions?.[index]?.optionContent
                                    }
                                    size="small"
                                    label="Correct Response"
                                    name="optionContent"
                                    value={d?.optionContent}
                                    onChange={(e) =>
                                      columnOptionchange(e, i, index)
                                    }
                                    type="text"
                                  />
                                </Grid>
                              );
                            }
                          })}
                          <Typography
                            style={
                              error?.[
                                (currentPageRef.current - 1) * itemsPerPage + i
                              ]?.responseOption
                                ? {
                                    color: 'red',
                                    fontSize: '14px',
                                    marginTop: '15px',
                                  }
                                : { display: 'none' }
                            }
                          >
                            Options are mandatory to publish assessment
                          </Typography>
                          <Grid
                            xs={12}
                            md={12}
                            style={
                              data.responseType === '' ||
                              data.responseType === 'Number' ||
                              data.responseType === 'Text' ||
                              data.responseType === 'Open'
                                ? { display: 'none' }
                                : { marginTop: '20px' }
                            }
                          >
                            <Button
                              variant="contained"
                              style={{ marginRight: '20px' }}
                              onClick={() => handleOptionAdd(i)}
                              disabled={
                                state?.value?.likert == 'true' ||
                                state?.value?.likert == true
                              }
                            >
                              Add Option
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() =>
                                handleDeleteOpiton(data?.responseOptions, i)
                              }
                              disabled={
                                state?.value?.likert == 'true' ||
                                state?.value?.likert == true
                              }
                            >
                              Remove Option
                            </Button>
                          </Grid>
                        </Grid>
                        {/* {buttons grid} */}
                        <Grid
                          xs={4}
                          style={
                            val?.length == 1
                              ? {
                                  display: 'none',
                                  height: '36px',
                                }
                              : {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  height: '200px',
                                }
                          }
                          //   style={{ display: 'flex', justifyContent: 'end' }}
                        >
                          <Grid
                            xs={12}
                            style={
                              (currentPageRef.current - 1) * itemsPerPage + i ==
                              0
                                ? { display: 'none' }
                                : {}
                            }
                          >
                            <Button
                              // size="large"
                              variant="contained"
                              onClick={() => moveUp(i)}
                              size="small"
                              style={
                                (currentPageRef.current - 1) * itemsPerPage +
                                  i ==
                                0
                                  ? { display: 'none' }
                                  : {
                                      fontSize: '12px',
                                      height: '29px',
                                      alignSelf: 'center',
                                    }
                              }
                            >
                              {/* <ArrowCircleUpIcon fontSize="large" /> */}
                              Move Up
                            </Button>
                          </Grid>
                          <Grid
                            xs={12}
                            style={
                              (currentPageRef.current - 1) * itemsPerPage +
                                i +
                                1 >=
                              val.data.length
                                ? { display: 'none' }
                                : {}
                            }
                          >
                            <Button
                              // size="large"
                              variant="contained"
                              onClick={() => moveDown(i)}
                              size="small"
                              style={
                                (currentPageRef.current - 1) * itemsPerPage +
                                  i +
                                  1 >=
                                val.data.length
                                  ? { display: 'none' }
                                  : {
                                      fontSize: '12px',
                                      height: '29px',
                                      alignSelf: 'center',
                                    }
                              }
                            >
                              Move Down
                              {/* <ArrowCircleDownIcon fontSize="large" /> */}
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              variant="contained"
                              onClick={() => handleAddAfter(i)}
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                            >
                              Add
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                              // style={{ height: '36px', marginRight: '20px' }}
                              variant="contained"
                              onClick={() => handledelete(i)}
                            >
                              Remove
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                              // style={{ height: '36px' }}
                              variant="contained"
                              onClick={() =>
                                handleAddFrame(val?.framing?.length + 1, i)
                              }
                            >
                              Add Framing Content
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider
                        style={
                          val?.data.length == 1 || val?.data.length === i + 1
                            ? { display: 'none', width: '100%' }
                            : {
                                width: '100%',
                                marginTop: '20px',
                                marginBottom: '20px',
                              }
                        }
                      />
                    </>
                  );
                }
                if (data.type === 'framing') {
                  framingIndex = framingIndex + 1;
                  return (
                    <>
                      <Grid
                        item
                        xs={12}
                        md={12}
                        style={{ marginTop: '20px', display: 'flex' }}
                      >
                        <Grid xs={8} md={8}>
                          <label style={{ fontSize: '12px' }}>
                            {data?.framingLabel}
                          </label>
                          <SunEditor
                            // setContents="My contents"
                            setContents={data?.framingContent}
                            height="10"
                            name="framingContent"
                            autoFocus={false}
                            onChange={(e) => {
                              columnchange(
                                {
                                  target: { name: 'framingContent', value: e },
                                },
                                i
                              );
                            }}
                            setDefaultStyle="height: auto"
                            setOptions={{
                              katex: katex,
                              mode: 'inline',
                              buttonList: [
                                [
                                  'undo',
                                  'redo',
                                  'font',
                                  'fontSize',
                                  'formatBlock',
                                  'blockquote',
                                  'bold',
                                  'underline',
                                  'italic',
                                  'strike',
                                  'subscript',
                                  'superscript',
                                  'fontColor',
                                  'hiliteColor',
                                  'textStyle',
                                  'removeFormat',
                                  'outdent',
                                  'indent',
                                  'align',
                                  'horizontalRule',
                                  'list',
                                  'lineHeight',
                                  'fullScreen',
                                  'showBlocks',
                                  'codeView',
                                  'preview',
                                  'print',
                                  'link',
                                  'horizontalRule',
                                  'math',
                                  'table',
                                  'image',
                                ],
                              ],
                            }}
                          />
                        </Grid>
                        <Grid
                          xs={4}
                          style={
                            val?.length == 1
                              ? {
                                  display: 'none',
                                  height: '36px',
                                }
                              : {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  height: '200px',
                                }
                          }
                          //   style={{ display: 'flex', justifyContent: 'end' }}
                        >
                          <Grid
                            xs={12}
                            style={
                              (currentPageRef.current - 1) * itemsPerPage + i ==
                              0
                                ? { display: 'none' }
                                : {}
                            }
                          >
                            <Button
                              // size="large"
                              variant="contained"
                              onClick={() => moveUp(i)}
                              size="small"
                              style={
                                (currentPageRef.current - 1) * itemsPerPage +
                                  i ==
                                0
                                  ? { display: 'none' }
                                  : {
                                      fontSize: '12px',
                                      height: '29px',
                                      alignSelf: 'center',
                                    }
                              }
                            >
                              {/* <ArrowCircleUpIcon fontSize="large" /> */}
                              Move Up
                            </Button>
                          </Grid>
                          <Grid
                            xs={12}
                            style={
                              (currentPageRef.current - 1) * itemsPerPage +
                                i +
                                1 >=
                              val.data.length
                                ? { display: 'none' }
                                : {}
                            }
                          >
                            <Button
                              // size="large"
                              variant="contained"
                              onClick={() => moveDown(i)}
                              size="small"
                              style={
                                (currentPageRef.current - 1) * itemsPerPage +
                                  i +
                                  1 >=
                                val.data.length
                                  ? { display: 'none' }
                                  : {
                                      fontSize: '12px',
                                      height: '29px',
                                      alignSelf: 'center',
                                    }
                              }
                            >
                              Move Down
                              {/* <ArrowCircleDownIcon fontSize="large" /> */}
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              variant="contained"
                              onClick={() => handleAddAfter(i)}
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                            >
                              Add
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                              // style={{ height: '36px', marginRight: '20px' }}
                              variant="contained"
                              onClick={() => handledelete(i)}
                            >
                              Remove
                            </Button>
                          </Grid>
                          <Grid xs={12}>
                            <Button
                              size="small"
                              style={{
                                fontSize: '12px',
                                height: '29px',
                                alignSelf: 'center',
                              }}
                              // style={{ height: '36px' }}
                              variant="contained"
                              onClick={() =>
                                handleAddFrame(val?.framing?.length + 1, i)
                              }
                            >
                              Add Framing Content
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider
                        style={
                          val?.data.length == 1 || val?.data.length === i + 1
                            ? { display: 'none', width: '100%' }
                            : {
                                width: '100%',
                                marginTop: '20px',
                                marginBottom: '20px',
                              }
                        }
                      />
                    </>
                  );
                }
              })}
            <div
              style={
                val?.data?.length > 5
                  ? {
                      width: '100%',
                      display: 'flex',
                      marginTop: '20px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }
                  : { display: 'none' }
              }
            >
              <Button
                onClick={handleBackClick}
                variant="contained"
                disabled={currentPage === 1}
              >
                Back
              </Button>
              <div>
                Page : {currentPage} / {totalPages}
              </div>

              <div>Total No : {val?.data?.length}</div>
              <Button
                onClick={handleNextClick}
                variant="contained"
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div style={{ width: '100%', height: '20px' }}></div>
          </Grid>
        </Grid>
      </Grid>
      <AssessmentDiscipline open={openForm} setOpenForm={setOpenForm} />

      {/* Image Alternate Text Dialog */}
      <Dialog
        open={open}
        style={{ zIndex: +1 }}
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            height: '500px',
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>View Image Alternative Text</div>
            <div>
              <CloseIcon onClick={handleClickClose} />
            </div>
          </div>
        </DialogTitle>
        <div style={{ margin: '20px' }}>
          <p style={{ marginBottom: '10px', fontSize: '12px' }}>
            The table below shows the alternate text associated to each image in
            this assessment. Alternate text should not be empty for
            accessibility purposes.
          </p>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <Hidden xsDown>
                    <TableCell>Image</TableCell>
                  </Hidden>
                  <TableCell>Alternate Text</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {imageAlternateData.map((row: any) => (
                  <TableRow key={row.alt}>
                    <Hidden xsDown>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: '50%' }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: row?.image?.replace(/\\/g, ''),
                          }}
                        />
                      </TableCell>
                    </Hidden>
                    <TableCell>{row.alt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Dialog>

      {/* Likert Dialog */}
      <Dialog open={likertOpen} style={{ zIndex: +10 }}>
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>Likert Response Options</div>
            <div>
              <CloseIcon onClick={() => setLikertOpen(false)} />
            </div>
          </div>
        </DialogTitle>

        <DialogContent
          sx={{ width: '600px', height: 'fitContent', overflowX: 'hidden' }}
        >
          <Grid
            xs={12}
            md={12}
            style={{ marginTop: '40px', marginBottom: '20px' }}
          >
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">Response Type:</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={likert?.responseType}
                disabled
                name="responseType"
                label="Response Type:"
                onChange={(e) => handleLikertChange(e)}
                defaultValue="Single"
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Multiple">Multiple</MenuItem>
                <MenuItem value="Number">Number</MenuItem>
                <MenuItem value="Text">Text</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={12}
            style={
              state?.value?.key == 'true'
                ? { paddingBottom: '20px', paddingTop: '20px' }
                : { display: 'none' }
            }
          >
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">is Scored:</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={likert?.isScored}
                name="isScored"
                label="Is Scored:"
                onChange={(e) => handleLikertChange(e)}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={12}
            style={{ marginTop: '20px' }}
            // style={
            //   data?.responseType == 'Single' ||
            //   data?.responseType == 'Multiple'
            //     ? { marginTop: '10px', marginBottom: '10px' }
            //     : { display: 'none' }
            // }
            // style={{ marginTop: '10px', marginBottom: '10px' }}
          >
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">
                Options Orientation:
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={likert?.optionOrientation}
                name="optionOrientation"
                label="Options Orientation:"
                onChange={(e) => handleLikertChange(e)}
                defaultValue="Vertical"
              >
                <MenuItem value="Vertical">Vertical</MenuItem>
                <MenuItem value="Horizontal">Horizontal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {likert?.responseOptions.map((data: any, index: any) => {
            return (
              <Grid
                container
                xs={12}
                md={12}
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                }}
                // style={{
                //   display: 'flex',
                //   justifyContent: 'space-between',
                //   alignItems: 'center',
                //   marginTop: '20px',
                // }}
              >
                <Grid
                  item
                  xs={3}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {/* <Radio
                    style={
                      state?.value?.key == 'true'
                        ? { marginRight: '20px' }
                        : { display: 'none' }
                    }
                    // checked={JSON.stringify(index + 1) == data?.defaultAnswer}
                    // checked={selectedValue === 'a'}
                    // onChange={(e: any) => handleRadioChange(e, i)}
                    // value={JSON.stringify(index + 1)}
                    name="radio-buttons"
                  /> */}

                  <Tooltip title="Option Label: " placement="top">
                    <TextField
                      disabled={
                        state?.value?.optionType == 'Custom' ? false : true
                      }
                      style={{
                        width: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      size="small"
                      name="optionLabel"
                      onChange={(e) => handleLikertOptionChange(e, index)}
                      type="text"
                      value={data?.optionLabel}
                    />
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  xs={9}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <label style={{ fontSize: '12px' }}>Option Content:</label>
                  <SunEditor
                    // defaultValue={data.optionContent}
                    setContents={data?.optionContent}
                    // defaultValue={data?.optionContent}
                    name="optionContent"
                    autoFocus={false}
                    onChange={(e: any) => {
                      handleLikertOptionChange(
                        {
                          target: {
                            name: 'optionContent',
                            value: e,
                          },
                        },
                        index
                      );
                    }}
                    setDefaultStyle="height: auto"
                    setOptions={{
                      katex: katex,
                      mode: 'inline',
                      buttonList: [
                        [
                          'undo',
                          'redo',
                          'font',
                          'fontSize',
                          'formatBlock',
                          'blockquote',
                          'bold',
                          'underline',
                          'italic',
                          'strike',
                          'subscript',
                          'superscript',
                          'fontColor',
                          'hiliteColor',
                          'textStyle',
                          'removeFormat',
                          'outdent',
                          'indent',
                          'align',
                          'horizontalRule',
                          'list',
                          'lineHeight',
                          'fullScreen',
                          'showBlocks',
                          'codeView',
                          'preview',
                          'print',
                          'link',
                          'horizontalRule',
                          'math',
                          'table',
                          'image',
                        ],
                      ],
                    }}
                  />
                </Grid>
              </Grid>
            );
          })}

          <Grid
            xs={12}
            md={12}
            style={{
              marginTop: '20px',
            }}
            // style={
            //   data.responseType === '' ||
            //   data.responseType === 'Number' ||
            //   data.responseType === 'Text' ||
            //   data.responseType === 'Open'
            //     ? { display: 'none' }
            //     : { marginTop: '20px' }
            // }
          >
            <Button
              variant="contained"
              style={{ marginRight: '20px' }}
              onClick={() => handleOptionAddLikert()}
            >
              Add Option
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDeleteOpitonLikert()}
            >
              Remove Option
            </Button>
          </Grid>
          <Grid
            xs={12}
            md={12}
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                const value: any = { ...val };

                const likertData: any = [];

                value.data.map((d: any) => {
                  if (d.type == 'question') {
                    const data: any = d;
                    data.responseOptions = likert?.responseOptions;
                    data.optionOrientation = likert?.optionOrientation;
                    data.responseType = likert?.responseType;
                    data.isScored = likert?.isScored;
                    data.type = 'question';
                    data.defaultAnswer = likert?.defaultAnswer;
                    likertData.push(data);
                  } else {
                    likertData.push(d);
                  }
                });
                if (
                  val?.filterQuestion?.filterResponse >
                  value?.data[val.filterQuestion?.filterQuestion - 1]
                    ?.responseOptions?.length
                ) {
                  const filterData = value.filterQuestion;
                  filterData.filterResponse = '';
                  setVal({ ...val, filterQuestion: filterData });
                }
                // setLikert(likertData);
                setVal({ ...value, data: likertData, likert: likert });
                setLikertOpen(false);
              }}
            >
              Save
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Assessment Filter Dialog */}
      <Dialog
        open={filterOpen}
        style={{ zIndex: +1 }}
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            height: '350px',
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#1663ab', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>Assessment Filter Options</div>
            <div>
              <CloseIcon
                onClick={() => {
                  setFilterQuestion({
                    filterQuestion: state?.value?.question?.filterQuestion
                      ?.filterQuestion
                      ? state?.value?.question?.filterQuestion?.filterQuestion
                      : '',
                    filterResponse: state?.value?.question?.filterQuestion
                      ?.filterResponse
                      ? state?.value?.question?.filterQuestion?.filterResponse
                      : '',
                  });
                  setFilterOpen(false);
                }}
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid xs={12} md={12} style={{ marginTop: '20px' }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <label id="demo-select-small">Filter Question:</label>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={filterQuestion?.filterQuestion}
                name="optionOrientation"
                label="Options Orientation:"
                onChange={(e) => {
                  setFilterQuestion({
                    ...filterQuestion,
                    filterQuestion: e.target.value,
                  });
                }}
                defaultValue={filterQuestion?.filterQuestion}
              >
                {filterData?.map((d: any, i: any) => (
                  <MenuItem value={`${i + 1}`}>{i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            xs={12}
            md={12}
            style={
              state?.value?.key == 'true' || state?.value?.key == true
                ? { display: 'none' }
                : { marginTop: '20px' }
            }
          >
            <FormControl sx={{ minWidth: 120 }} size="small">
              <label id="demo-select-small">
                Filter Question Correct Response:
              </label>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={filterQuestion?.filterResponse}
                name="optionOrientation"
                label="Options Orientation:"
                onChange={(e) => {
                  setFilterQuestion({
                    ...filterQuestion,
                    filterResponse: e.target.value,
                  });
                }}
                defaultValue={filterQuestion?.filterResponse}
              >
                {filterQuestion?.filterQuestion
                  ? filterData[
                      filterQuestion?.filterQuestion - 1
                    ]?.responseOptions?.map((e: any, i: any) => {
                      return <MenuItem value={`${i + 1}`}>{i + 1}</MenuItem>;
                    })
                  : filterData[
                      filterQuestion?.filterQuestion - 1
                    ]?.responseOptions?.map((e: any, i: any) => {
                      return <MenuItem value={`${i + 1}`}>{i + 1}</MenuItem>;
                    })}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            xs={12}
            md={12}
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <Button
              variant="contained"
              disabled={
                state?.value?.key === true || state?.value?.key === 'true'
                  ? filterQuestion?.filterQuestion == ''
                  : filterQuestion?.filterQuestion == '' ||
                    filterQuestion?.filterResponse == ''
              }
              onClick={() => {
                setVal((prev: any) => {
                  return {
                    ...prev,
                    filterQuestion: filterQuestion,
                  };
                });
                setFilterOpen(false);
              }}
              style={{ marginRight: '8px' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setFilterQuestion({
                  filterQuestion: val?.filterQuestion?.filterQuestion
                    ? val?.filterQuestion?.filterQuestion
                    : '',
                  filterResponse: val?.filterQuestion?.filterResponse
                    ? val?.filterQuestion?.filterResponse
                    : '',
                });
                setFilterOpen(false);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssesmentQuestion;
