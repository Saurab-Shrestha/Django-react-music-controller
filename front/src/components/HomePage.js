import React, { Component } from "react";

import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
import { Navigate } from 'react-router-dom';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    }; 
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} align="center"></Grid>
      </Grid>
    );
  }

  clearRoomCode(){
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
      <h1>Hello</h1>
        <Routes>
          <Route  exact path="/" 
          render ={()=>{
            return this.state.roomCode ? (<Navigate to={`/room/${this.state.roomCode}`}/>) : (this.renderHomePage()) 
          }}>
           
          </Route>
          <Route path="/create" element={<CreateRoomPage />}>
            Create Room
          </Route>
          <Route path="/join" element={<RoomJoinPage />}>
            Room Join
          </Route>
          <Route path="/room/:roomCode" 
          render = {(props)=>{
            return <Room {...props} leaveRoomCallback={this.clearRoomCode}/>
          }}
          ></Route>
        </Routes>
      </Router>
    );
  }
}
