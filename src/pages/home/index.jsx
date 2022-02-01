import React, { Component } from "react";

export default class Home extends Component {
state = {
  posts:[],
}
  componentDidMount = () => {
    fetchData()
    console.log('hi')
  }
  
  fetchData = async() => {
    try {
      let response = await fetch('http://localhost:3001/posts',{
        method:'GET'
      })
      if(response.ok){
        let data = await response.json()
        this.setState({posts:data})
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return <div>
    
      </div>;
  }
}
