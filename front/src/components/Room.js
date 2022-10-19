import React, { Component } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSetting: false,
    };
    this.roomCode = this.props.match.params.roomCode;

    this.getRoomDetails();
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
  }

  getRoomDetails() {
    const navigate = useNavigate();
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }
  leaveButtonPressed() {
    const navigate = useNavigate();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.navigate("/");
    });
  }

  updateShowSettings(value) {
    this.setState({
      showSetting: value,
    });
  }
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.updateShowSettings(true);
          }}
        >
          Settings
        </Button>
      </Grid>
    );
  }
  renderSettings() {
    return (
      <Grid container spacing={1}>
      <Grid items xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={this.state.votesToSkip}
          guestCanPause={this.state.guestCanPause}
          roomCode={this.roomCode}
          updateCallback={() => {}}
        />
      </Grid>
      <Grid items xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={() => this.updateShowSettings(false)}
        ></Button>
      </Grid>
    </Grid>
    );

  }
  render() {
    if (this.state.showSetting) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h5" component="h4">
            Code: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h5" component="h4">
            Code: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h5" component="h4">
            Code: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {/* settings button */}
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed()}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}
