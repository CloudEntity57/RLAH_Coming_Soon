import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
const url = 'https://polar-waters-86989.herokuapp.com';

export default class HostRegistration extends Component{
  constructor(props){
    super(props);
    this.state={
      address:this.props.match.params.addr,
      selected_option:'yes',
      price:false,
      staging:false,
      timing:false,
      improvements:false,
      buyers_interested:false,
      other:false,
      agrees:false,
      next_ok:false
    }
  }
  componentDidMount(){
    let a
    console.log('address: ',this.props.match.params.addr)
  }
  handleOptionChange(e){
    console.log(e.target.value)
    this.setState({
      selected_option:e.target.value
    });
    setTimeout(()=>{
      this.isFormFilled();
    },20);
  }
  handleRadioChange(e){
    const property = e.target.id;
    let yes_no = this.state[property]
    console.log(property,' was checked: ',yes_no)
    var stateObject = function() {
      let returnObj = {};
      returnObj[property] = !yes_no;
      return returnObj;
    }();
    this.setState(stateObject);
    setTimeout(()=>{
      this.isFormFilled();
    },20);
  }
  handleAgree(){
    this.setState({
      agrees:!this.state.agrees
    });
    setTimeout(()=>{
      this.isFormFilled();
    },20);
  }
  isFormFilled(){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   const isEmail = re.test(String(this.refs.agent_email.value).toLowerCase());

   const ready =
   this.refs.agent_name !=='' && this.state.agrees && isEmail && this.refs.est_size.value !=='' && (this.state.selected_option =='yes' || this.state.selected_option =='no') && (this.state.price || this.state.staging || this.state.timing || this.state.improvements || this.state.other || this.state.buyers_interested);

    if(ready){
      console.log('ready to go')
      this.setState({
        next_ok:true
      });
    }else{
      this.setState({
        next_ok:false
      });
    };
  }
  submitRegistration(e){
    let address = this.state.address;
    let est_size = this.refs.est_size.value;
    let expected_price = this.refs.expected_price.value;
    let agent_name = this.refs.agent_name.value;
    let email = this.refs.agent_email.value;
    let will_show_before_listing = this.state.selected_option;
    let feedback_wanted = [];
    for(let i in this.state){
      if(this.state[i]==true && i!=='agrees' && i !=='next_ok'){
        feedback_wanted.push(i);
      }
    }
    let data = {
      address,
      est_size,
      expected_price,
      agent_name,
      email,
      will_show_before_listing,
      feedback_wanted
    }
    console.log('you submitted: ',data);
      axios.post(url + '/info/submitform',data).then((response)=>{
        if(response.data.message === "Queued. Thank you."){
          this.props.history.push('/agenda');
        }
      }).catch((err)=>{
        console.log('form submission error - ',err);
      });

  }
  render(){
    const submit = (this.state.next_ok) ? (
      <span onClick={()=>this.submitRegistration()} className="main_submit">SUBMIT</span>
    ):(
      <span className="main_submit muted">SUBMIT</span>
    )
    return(
      <main>
        <h1 className="coming_soon_title">Coming Soon Tour</h1>
        <div className="host_title">
          HOST
        </div>
        <div className="address_checker">
          <div className="row">
            <div className="col-sm-3">
              <div className="prop_address">Address:</div>
            </div>
            <div className="col-sm-9">
              <span className="checker_addr">
                { this.state.address }
              </span>
            </div>
          </div>
        </div>
        <section className="host_form">
          <form>
            <p>*denotes required field for submission</p>
            <div><div className="form_labels">Listing Agent Name*:</div>&nbsp;<div className="form_inputs"><input onKeyUp={this.isFormFilled.bind(this)} ref="agent_name" type="text" /></div></div>
            <div><div className="form_labels">Listing Agent Email*:</div>&nbsp;<div className="form_inputs"><input onKeyUp={this.isFormFilled.bind(this)} ref="agent_email" type="text" /></div></div>
            <div><div className="form_labels">Expected Price:</div>&nbsp;<div className="form_inputs"><input ref="expected_price" type="text" /></div></div>
            <div><div className="form_labels">Estimated Size (sqft)*:</div>&nbsp;<div className="form_inputs"><input onKeyUp={this.isFormFilled.bind(this)} ref="est_size" type="text" /></div></div>
            <div className="form_inputs">Will seller show home/consider
  offers prior to listing?*:</div>&nbsp;
              <div className="form_labels">
                <div>
                  <input onChange={this.handleOptionChange.bind(this)} type="radio" value='yes' checked = {this.state.selected_option==='yes'} id="radio_no" name="yes_no" /><label for="radio_no">Yes</label>
                  <input onChange={this.handleOptionChange.bind(this)} type="radio" value='no' checked = {this.state.selected_option==='no'} id="radio_yes" name="yes_no" /><label for="radio_yes">No</label>
                </div>
              </div>
          </form>
        </section>
        <section className="feedback">
          <div className="feedback_msg">
            Feedback host is seeking from peers on tour*:
          </div><br/>
          <div className="feedback_options row">
            <div className="col-xs-2">

            </div>
            <form>
            <div className="col-xs-4">
              <div>
                <input onChange={this.handleRadioChange.bind(this)} ref='price' type="checkbox" id="price"  name="radio_feedback" /><label for="price">Price</label><br/>
                <input onChange={this.handleRadioChange.bind(this)} ref='staging' type="checkbox" id="staging" name="radio_feedback"/><label for="radio">Staging</label><br/>
                <input onChange={this.handleRadioChange.bind(this)} ref='timing' type="checkbox" id="timing" value="radio_feedback" name="radio"  /><label for="radio_timing">Timing</label>
              </div>
            </div>
            <div className="col-xs-6">
              <input onChange={this.handleRadioChange.bind(this)} ref='improvements' type="checkbox" id="improvements" value="radio_improvements"  name="radio_feedback" /><label for="radio_improvements">Improvements</label><br/>
              <input onChange={this.handleRadioChange.bind(this)} ref='buyers_interested' type="checkbox" id="buyers_interested" value="radio_buyers_interested" name="radio_feedback"  /><label for="radio_buyers_interested">Buyers Interested</label><br/>
              <input onChange={this.handleRadioChange.bind(this)} ref='other' type="checkbox" id="other" value="radio_other" name="radio_feedback" /><label for="radio_other">Other</label><br/>
            </div>
          </form>
          </div>
        </section>
        <section className="reminder">
          REMINDER: Finalized tour logisitics will be determined and distributed after final property
          is submitted, but no later than 6pm on the previous Monday. Tour details will be posted at
          <Link to="/agenda">comingsoontour.com/agenda</Link> AND sent to all members via email in participating brokerage(s).
        </section>
        <section className="terms_conditions">
          <input onChange={this.handleAgree.bind(this)} type="checkbox" id="terms_conditions_radio" value="terms_conditions_radio" name="terms_conditions_radio"  /><label className="terms_conditions_link">I agree to the terms and conditions</label>
        </section>
        <section className="submit_btn">
          { submit }
        </section>
        <Footer />
      </main>
    );
  }
}
