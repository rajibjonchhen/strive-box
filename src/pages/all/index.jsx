import backend from "client/http";
import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { createRef } from "react";
import "./all.css";
export default class All extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      files: [],
      file: null,
      title:'',
      seeImg:null
    };
    this.ref = createRef();
  }
  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      let response = await fetch('http://localhost:3001/posts',{
        method:'GET'
      })
      if(response.ok){
        let data = await response.json()
        this.setState({ files: data, loading: false });
        console.log(data)
      }
    } catch (error) {
      console.error(error)
    }
   
  };

  handleFileClick = (e) => {
    this.ref.current.click();
    this.setState({file:e.target.files[0]})
  };

  handleFileChange = async (e) => {
    const [file, ...rest] = e.target.files;
    console.log(this.state.files[0])
    const formData = new FormData();
    formData.append("image", file);
    try {
      // await backend.post("/files", formData);
     let response = await fetch('http://localhost:3001/posts',{
        method:"POST",
        body:formData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleFileDelete = async (id) => {
    try {
      await backend.delete(`/files/${id}`);
      // this.fetchFiles();
      let response = await fetch('http://localhost:3001/posts/' + id, {
        method:'DELETE',
        }
      )
    } catch (error) {
      console.log(error);
    }
  };
  changeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  renameFile = async (id) => {
    try {
      // await backend.put(`/files/${id}`, { title: this.state.title });
      // this.fetchFiles();
      let response = await fetch('http://localhost:3001/posts/' + id, {
        method:'PUT',
        body: JSON.stringify({title: this.state.title}),
        header:{
          "Content-Type": "application/JSON",
        }
      })
      if(response.ok){
        let data = await response.json()
        console.log(data)
        console.log(JSON.stringify({ title: this.state.title }))
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { files, loading } = this.state;
    return (
      <div>
        <input
          onChange={this.handleFileChange}
          type="file"
          hidden
          ref={this.ref}
        />
        <div className="d-flex justify-content-end">
          <Button
            onClick={this.handleFileClick}
            variant="dark"
            className="mb-5"
          >
            Upload
          </Button>
        </div>
        {!loading && files.length > 0 && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td></td>
                    <td>
                      <input
                        onChange={this.changeTitle}
                        className="file-name"
                        onBlur={() => this.renameFile(file.id)}
                        type="text"
                        defaultValue={file.title}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            this.renameFile(file.id);
                          }
                        }}
                      />
                       <div className="bg-dark p-3 w-100 h-100 " style={{display:this.state.seeImg===file.id? 'block':'none',position:'fixed',zIndex:'1', top:'0', left:'0'}}>
                        <div onClick={(e)=>this.setState({seeImg:false})}><button className='p-1 px-2 my-2 rounded-lg bg-dark text-white'>Close</button></div>
                        <img src={file.link} className='mx-auto my-auto' style={{width:'1000px',}}/>
                      </div>
                    </td>
                    <td>{file.size}</td>
                    <td>
                      <Button as="a" onClick={(e)=> this.setState({seeImg:file.id})} variant="dark">
                        See
                      </Button>
                     
                      <Button
                        as="a"
                        href={file.downloadUrl}
                        className="ml-2"
                        variant="success"
                      >
                        Download
                      </Button>
                      <Button
                        onClick={() => this.handleFileDelete(file.id)}
                        className="ml-2"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    );
  }
}
