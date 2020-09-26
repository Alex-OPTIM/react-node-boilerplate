import React, {Component} from "react";
import "./home-view.css";
import {Button} from "@blueprintjs/core";
import SocketUiService from "../../services/socket_ui.service";
import {UiSocketTopic} from "../../_common/socket.config";

interface HomeViewProps {
}

interface HomeViewState {
    isSocketConnected: boolean,
    nodeTime: number
}

export default class HomeView extends Component<HomeViewProps, HomeViewState> {
    private socket = SocketUiService.socketIo;

    constructor(props: HomeViewProps) {
        super(props);

        this.state = {
            isSocketConnected: false,
            nodeTime: 0
        }
    }

    componentWillUnmount() {
        SocketUiService.removeAllListeners();
    }

    componentDidMount() {
        this.registerSocketListeners();
        this.setState({isSocketConnected: SocketUiService.isConnected()});
    }

    registerSocketListeners() {
        this.socket.on(UiSocketTopic.connect, () => this.setState({isSocketConnected: true}));
        this.socket.on(UiSocketTopic.disconnect, () => this.setState({isSocketConnected: false}));

        this.socket.on(UiSocketTopic.checkTimeRes, (nodeTime: number) => this.setState({nodeTime}));
    }


    checkTime = () => {
        this.socket.emit(UiSocketTopic.checkTimeReq)
    }

    render() {
        const {nodeTime} = this.state;

        return (
            <div className="home-view">
                <p>This is HomeView</p>
                <Button onClick={this.checkTime}>Check Time</Button>
                <p>
                    {
                        nodeTime ?
                            "Time from NodeJS process: " + (new Date(nodeTime)).toLocaleString() :
                            "Click the button to get time from NodeJs process"
                    }
                </p>
            </div>
        );
    }
}
