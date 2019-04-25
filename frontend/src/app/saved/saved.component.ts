import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobdataService } from '../jobdata.service';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from '../user.service';
import { parseString } from 'xml2js';



declare var $: any;

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {


  refresh()
  {
    this.http.get("/api/saved/").subscribe((res)=>{
      //this.user.updatedIndustry = false; //update our flag to represent that the user has not updated their industry since our most recent search
      this.response = res;
      this.saved = this.response.data;
      this.loading = false;
      this.error = "";
      this.data.saveJobsLocally(this.jobs);
    }, (error) => {
      this.loading = false;
      this.error = error.error.error;
      console.log("error with getJobs");
    })
  }

  confirmUserIndustryAndGetJobs(){
      this.user.getIndustry().subscribe((res) => {
        this.response = res;
        this.user.industry = this.response.industry;
        this.http.get("/api/jobs/").subscribe((res)=>{
          this.response = res;
          this.jobs = this.response.data;
          this.loading = false;
          this.error = "";
          this.data.saveJobsLocally(this.jobs);
        }, (error) => {
          this.loading = false;
          this.error = error.error.error;
          console.log("error with getJobs");
        })
      }, (error) => {
        //Assume that the user does not have an industry set
        alert(error.error);
        this.loading = false;
        this.error = error.error;
        this.canSearch = false;
        if (this.user.industry == undefined)
        {
          this.activateUpdateUserIndustryModal();
        }
      })
  }



  ngOnInit() {
    this.loading = true;
    this.error = "";
    if(this.data.jobsSaved && !this.user.updatedIndustry){
      console.log("Getting previously saved jobs");
      this.jobs = this.data.getLocallySavedJobs();
      this.loading = false;
    }
    else{
      console.log("Executing new job search");
      this.confirmUserIndustryAndGetJobs();
    }

  }

}
