import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Box, TextField, InputAdornment, Button, Typography,CircularProgress  } from '@mui/material';
import Articles from './Articles';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';
import './Main.css'

const Main = () => {
  const [topic,setTopic]=useState("")
  const [searched,setSearched]=useState("")
  const [data,setData]=useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [choosed,setChoosed]=useState(false)
const popularSearches=["Pyhton","Java","Mobile","Laptop","React","Health"]


  const onchange=(e)=>{
    setTopic(e.target.value)
   
  }
  // handling submmision
  const submit=async()=>{
    setSearched(topic)
    if(!topic){
      toast.error("Enter a Topic to search")
      return;
    }
    setTopic("")
    setLoading(true);
    setError(false);
    setWrong(false);
    setData([])
    // scraping data using '/scrape'
    const res=await axios.post("http://localhost:8081/scrape",{topic})
    if(res.data.success){
      // getting data after scraping using '/articles'
      const result=await axios.get("http://localhost:8081/articles");
      setLoading(false);
      if( result.data.textContents.length===0 && result.data.titles.length===0 && result.data.dates.length===0 &&
        result.data.urls.length===0 && result.data.imgUrls.length===0
      ){
        setError(true)
      }
      else{
      const articles = result.data.textContents.map((name, index) => ({
        name,
        title: result.data.titles[index] || "N/A",
        date: result.data.dates[index] || "N/A",
        link: result.data.urls[index] || "N/A",
        image: result.data.imgUrls[index] || "N/A",
      }));
      console.log(articles)
      setData(articles)
    }
    }
    else{
      console.log(res.data.message)
      setLoading(false)
      setWrong(true)
    }
  }
  useEffect(() => {
    if (topic) {
      submit();
      setChoosed(false)
    }
  }, [choosed===true]);
  const buttonSearch=(each)=>{
    setTopic(each);
    setChoosed(true)
  }
  const StyledBox = styled(Box)({
    display: 'flex',
overflow:"auto",
    width: '100vw',
    backgroundColor: '#f5f5f5',
    scrollbarWidth: 'none', 
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  });
  return (
    <>
    <ToastContainer/>
    {/* search section */}
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '400px', 
        backgroundImage: 'url("https://images3.alphacoders.com/133/1338701.png")', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: 'white',
          width: '50%',
          fontWeight:"bold",
          width:{
            xs:"90%",
            sm:"90%",
            md:"90%"
          },
          fontFamily:"italic",
          marginBottom: 10, 
          fontSize: {
            xs: '2.5rem',
            sm: '2.5rem', 
            md: '2.5rem', 
            lg: '3rem', 
            xl: '3.75rem', 
          },
        }}
      >
        Welcome to <span style={{color:"white",fontWeight:"bold"}}>Pro</span><span style={{color:"skyblue",fontWeight:"bold"}}>cuzy </span> Articles- Your Ultimate Solution for Articles
      </Typography>
      <Box
        sx={{
          width: '80%', 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'green', 
          boxShadow: '0 3px 5px rgba(0,0,0,0.3)', 
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Articles"
          onChange={onchange}
          value={topic}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: { backgroundColor: 'white', borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px 0 0 4px',
              '&.Mui-focused fieldset': {
                borderColor: '#33A1C9', 
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#33A1C9',
            },
          }}
        />
        <Button
        onClick={submit}
          variant="contained"
          sx={{
            color: 'white', 
            backgroundColor: 'rgb(0, 70, 90)', 
            padding: '0px 30px 0 30px',
            fontWeight:'bold',
            borderRadius: '0 4px 4px 0', 
            height: '100%',
            '&:hover': {
              backgroundColor: 'rgb(0, 80, 90)', 
            }
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
    <StyledBox>
      {popularSearches.map((each) => (
        <Button
        onClick={() => buttonSearch(each)} 
          variant="contained"
          sx={{

            margin: '5px',
            backgroundColor: 'rgb(0, 70, 90)',
            '&:hover': {
              backgroundColor: 'rgb(0, 80, 90)'},
            whiteSpace: 'nowrap',
          }}
        >
          {each}
        </Button>
      ))}
    </StyledBox>
{/* handling loading */}
    {loading && <center>
      <Typography sx={{ color: 'rgb(0, 80, 95)',padding:"20px" }}>Searching Related Articles for {searched}</Typography>
      <CircularProgress size={20} sx={{ color: 'rgb(0, 80, 95)',padding:"20px" }} /></center>}
      
      {!loading && data.length === 0 && !error && (
      <center><Typography sx={{ color: 'rgb(0, 80, 95)',padding:"20px" }}>Search for articles to see the results.</Typography>
      <img style={{width:'20%',height:'20%'}} src="https://keywordtool.io/images/svg/undraw_web_search_eetr.svg" alt=""/>
      </center>
      )}
            {wrong && (
      <center><Typography sx={{ color: 'rgb(0, 80, 95)',padding:"20px" }}>Oops! Something Went wrong! Try Again</Typography></center>
      )}
      {!loading && error && (
       <center><Typography sx={{ color: 'rgb(0, 80, 95)',padding:"20px" }}>Oops! No results found.</Typography></center>
      )}
{/* display articles */}
  {data.length!==0 &&(<Articles data={data} searched={searched}/>)}
</>
  );
};
export default Main;
