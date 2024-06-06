import {  Button, Typography } from '@mui/material';
import { Container, Grid, Card, CardMedia } from '@mui/material';

const Articles=({data,searched})=>

        <Container>

      <Typography color={"rgb(0, 80, 95)"}  variant="h6" style={{fontWeight:"bold",padding: "16px 16px 16px 0"}}> Top {searched} Related Articles</Typography>
      <Grid container spacing={2}>
        {data.map((card, index) => (
          <Grid item key={index} xs={12} sm={6} md={6}>
            <Card className="properties-card">
                <div className="properties-main">
               <div className="label"> <Typography >Article</Typography></div>
                <div className="properties-content">
                <CardMedia
                component="img"
                className="properties-cardMedia"
                image={card.image}
                alt={card.title}
              />
              <div>
              <Typography variant="body1" component="div">
                  {card.name}
                </Typography>
               
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                   Published Date: {card.date}
                </Typography>
                
                </div> 
                </div>

                </div>
                <div className="properties-button">
            <a href={card.link} target="_blank">    <Button
      variant="contained"
      sx={{
        backgroundColor: 'rgb(0, 80, 95)',
        '&:hover': {
          backgroundColor: 'rgb(0, 85, 85)',
        },
      }}
    >
      View Article
    </Button></a>
                </div>
             
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    
export default Articles