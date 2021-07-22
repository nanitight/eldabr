import React from 'react';
import VideoPlayer from './VideoPlayer'
import './Playlist.css' ;
import axios from 'axios' ;

//The class for the playlist, it must atleast have one video. 
class Playlist extends React.Component {
    //the index must start from 0 when it's created from scratch, but if there was a current index already it must be used 
    //in the appropriate place
    constructor(props){
        super(props) ;
        this.state = {
            currVidIndex : 0 ,
            vidsArray: [ // we are supposed to receive the videos details from user input. we will work on that ..
        ],
            userName: 'PlaceHolder1' //props.userName
        }
    }
    getAllVideos= () =>{
        axios.get('http://localhost:9009/edcc/videos')
        // .then(res=>res.json())
        .then((res)=>{
            console.log('Backend',res) ;
            const responseData = res.data ; 

            if (responseData.data !== undefined){
                this.setState({
                    vidsArray:responseData.data
                },()=>{console.log('updating state')}) ;
            }
        })
        .catch(err=>console.log('Error in comms',err))

    }
    componentDidMount(){
        // alert('retriving old value') ;
        // let index = localStorage.getItem("CurrVidIndex") ;
        // if (!index===null){ //index is not equal to null
        //     this.setState({
        //         currVidIndex:index
        //     }) ;
        // }
        // else{
        //     this.setState({
        //         currVidIndex:0
        //     }) ;
        // }
       this.getAllVideos() ;
    }
    componentWillUnmount(){
        // when app unmonts it must store the current index video. If the playlist has one vid, index is 0 , 
        const index = localStorage.getItem("CurrVidIndex") ;

        if (index=== null){ //there was no stored variable
            localStorage.setItem("CurrVidIndex",this.state.currVidIndex) ; 
        }
        else{
            if (parseInt(index) !==  this.state.currVidIndex){ //check if i went back in the viewes list ,or it changed
                localStorage.setItem("CurrVidIndex",this.state.currVidIndex) ; 
            }
        }
    }

    // componentDidUpdate(){
    //     alert('update') ; //debug  step
    //     if (0 < this.state.currVidIndex){ //check if i went back in the viewes list
    //         localStorage.setItem("CurrVidIndex",this.state.currVidIndex) ; 
    //     }
    // }

    nextVideo =()=>{
        alert('pressed NExt') //debug  step
        const curr = this.state.currVidIndex ; 
        if (curr === (this.state.vidsArray.length-1)){
            // if the end of the array has been reached
            let ans = window.confirm('End of Current playlist is reached, do you want to jump to the next Playlist?') ; 
            if (ans === true){
                alert('Next PLAYLIST PLays Now') ; //debug  step
            }
            else{
                alert('start at first video') ;
                this.setState({
                    currVidIndex: 0 
                }); 
            }
        }
        else{
            this.setState({
                currVidIndex:this.state.currVidIndex+1
            }) ; 
        }
    }

    prevVideo = () =>{
        alert('pressed Prev') //debug  step
        const curr = this.state.currVidIndex ;
        if (curr === 0 ){
            alert('No Previous Video, Watch next video or watch another playlist') ;
            //prompt for next video or playlist
        }
        else{
            alert('moving to Prev video') ; 
            this.setState({
                currVidIndex:this.state.currVidIndex-1
            }) ; 
        }
    }

    playSelectedVideo = (num)=>{
        this.setState({
            currVidIndex:num
        }) ;
    }

    render(){
        // this.state.currVidIndex
        var  video = this.state.vidsArray[this.state.currVidIndex]  ; //object that represents the video
        console.log('video displayed',this.state) ;
        return (
            <div  id="bigContainer">
                <VideoPlayer 
                vidURL={video===undefined?{}:video}
                nextVideo={this.nextVideo}
                prevVideo={this.prevVideo}
                />
                <div>
                    <p>Playlist:{'?'}</p>
                    {this.state.vidsArray.map((vid,index)=>{
                        return <span>
                            <button className="click-btn"
                            onClick={()=>this.playSelectedVideo(index)}>
                                {vid.title}</button><br/></span>
                    })}
            </div>
            </div>
            )
    }
}

export default Playlist ;