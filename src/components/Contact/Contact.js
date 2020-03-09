/* eslint no-unused-vars: 0 */

import { navigate } from "gatsby";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import PropTypes from "prop-types";
import React from "react";

const FormItem = Form.Item;
const { TextArea } = Input;
import "antd/lib/form/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/button/style/index.css";
import { ThemeContext } from "../../layouts";
import ResumeData from "../../../content/resume/resume.yaml";

const Contact = props => {
  const { getFieldDecorator } = props.form;

  var name = ResumeData.main.name;
  var street = ResumeData.main.address.street;
  var city = ResumeData.main.address.city;
  var state = ResumeData.main.address.state;
  var zip = ResumeData.main.address.zip;
  var phone= ResumeData.main.phone;
  var email = ResumeData.main.email;
  var message = ResumeData.main.contactmessage;

  function encode(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        sendMessage(values);
      }
    });
  }

  function sendMessage(values) {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...values })
    })
      .then(() => {
        console.log("Form submission success");
        navigate("/success");
      })
      .catch(error => {
        console.error("Form submission error:", error);
        this.handleNetworkError();
      });
  }

  function handleNetworkError(e) {
    console.log("submit Error");
  }

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <div className="form">
            <p className="lead">{message}</p>
            <Form
              name="contact"
              onSubmit={handleSubmit}
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
              <FormItem label="Name">
                {getFieldDecorator("name", {
                  rules: [
                    {
                      whitespace: true
                    }
                  ]
                })(<Input name="name" />)}
              </FormItem>
              <FormItem label="E-mail">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your e-mail address!",
                      whitespace: true,
                      type: "email"
                    }
                  ]
                })(<Input name="email" />)}
              </FormItem>
              <FormItem label="Message">
                {getFieldDecorator("message", {
                  rules: [
                    { required: true, message: "Please input your message!", whitespace: true }
                  ]
                })(
                  <TextArea name="message" placeholder="" autosize={{ minRows: 4, maxRows: 10 }} />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormItem>
            </Form>

            {/* --- STYLES --- */}
            <style jsx>{`
              .form {
                background: transparent;
              }
              .form :global(.ant-row.ant-form-item) {
                margin: 0 0 1em;
              }
              .form :global(.ant-row.ant-form-item:last-child) {
                margin-top: 1em;
              }
              .form :global(.ant-form-item-control) {
                line-height: 1em;
              }
              .form :global(.ant-form-item-label) {
                line-height: 1em;
                margin-bottom: 0.5em;
              }
              .form :global(.ant-form-item) {
                margin: 0;
              }
              .form :global(.ant-input) {
                appearance: none;
                height: auto;
                font-size: 1.2em;
                padding: 0.5em 0.6em;
              }
              .form :global(.ant-btn-primary) {
                height: auto;
                font-size: 1.2em;
                padding: 0.5em 3em;
                background: ${theme.color.brand.primary};
                border: 1px solid ${theme.color.brand.primary};
              }
              .form :global(.ant-form-explain) {
                margin-top: 0.2em;
              }

              @from-width desktop {
                .form :global(input) {
                  max-width: 50%;
                }
              }
            `}</style>
          </div>
        )}
      </ThemeContext.Consumer>
    </React.Fragment>
  );
};

Contact.propTypes = {
  form: PropTypes.object
};

const ContactForm = Form.create({})(Contact);

export default ContactForm;



// import React, { Component } from 'react';

// class Contact extends Component {
//   render() {

//     if(this.props.data){
//       var name = this.props.data.name;
//       var street = this.props.data.address.street;
//       var city = this.props.data.address.city;
//       var state = this.props.data.address.state;
//       var zip = this.props.data.address.zip;
//       var phone= this.props.data.phone;
//       var email = this.props.data.email;
//       var message = this.props.data.contactmessage;
//     }

//     return (
//       <section id="contact">

//          <div className="row section-head">

//             <div className="two columns header-col">

//                <h1><span>Get In Touch.</span></h1>

//             </div>

//             <div className="ten columns">

//                   <p className="lead">{message}</p>

//             </div>

//          </div>

//          <div className="row">
//             <div className="eight columns">

//                <form action="" method="post" id="contactForm" name="contactForm">
// 					<fieldset>

//                   <div>
// 						   <label htmlFor="contactName">Name <span className="required">*</span></label>
// 						   <input type="text" defaultValue="" size="35" id="contactName" name="contactName" onChange={this.handleChange}/>
//                   </div>

//                   <div>
// 						   <label htmlFor="contactEmail">Email <span className="required">*</span></label>
// 						   <input type="text" defaultValue="" size="35" id="contactEmail" name="contactEmail" onChange={this.handleChange}/>
//                   </div>

//                   <div>
// 						   <label htmlFor="contactSubject">Subject</label>
// 						   <input type="text" defaultValue="" size="35" id="contactSubject" name="contactSubject" onChange={this.handleChange}/>
//                   </div>

//                   <div>
//                      <label htmlFor="contactMessage">Message <span className="required">*</span></label>
//                      <textarea cols="50" rows="15" id="contactMessage" name="contactMessage"></textarea>
//                   </div>

//                   <div>
//                      <button className="submit">Submit</button>
//                      <span id="image-loader">
//                         <img alt="" src="images/loader.gif" />
//                      </span>
//                   </div>
// 					</fieldset>
// 				   </form>

//            <div id="message-warning"> Error boy</div>
// 				   <div id="message-success">
//                   <i className="fa fa-check"></i>Your message was sent, thank you!<br />
// 				   </div>
//            </div>


//             <aside className="four columns footer-widgets">
//                <div className="widget widget_contact">

// 					   <h4>Address and Phone</h4>
// 					   <p className="address">
// 						   {name}<br />
// 						   {street} <br />
// 						   {city}, {state} {zip}<br />
// 						   <span>{phone}</span>
// 					   </p>
// 				   </div>

//                <div className="widget widget_tweets">
//                   <h4 className="widget-title">Latest Tweets</h4>
//                   <ul id="twitter">
//                      <li>
//                         <span>
//                         This is Photoshop's version  of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.
//                         Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum
//                         <a href="#">http://t.co/CGIrdxIlI3</a>
//                         </span>
//                         <b><a href="#">2 Days Ago</a></b>
//                      </li>
//                      <li>
//                         <span>
//                         Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
//                         eaque ipsa quae ab illo inventore veritatis et quasi
//                         <a href="#">http://t.co/CGIrdxIlI3</a>
//                         </span>
//                         <b><a href="#">3 Days Ago</a></b>
//                      </li>
//                   </ul>
// 		         </div>
//             </aside>
//       </div>
//    </section>
//     );
//   }
// }

// export default Contact;
