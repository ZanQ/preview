import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import previewStyles from '../../styles/preview.module.css'
 
import React from 'react';

import Head from 'next/head'
import styles from '../../components/layout.module.css'

import { Card, CardBody, Row, Col, CardFooter } from 'reactstrap';
import Slideshow from "./SlideshowSupport";
import Linkify from 'react-linkify';
import Swal from 'sweetalert2';

import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

const API_URL = 'https://extreme-ip-lookup.com/json/';

const URL_BASE = 'http://dev.zanq.co/';
//const URL_BASE ='http://localhost/ZanQ/';
const ANON_POST_DETAILS = URL_BASE + 'index.php/Api/Post/PostDetailWithoutIP';

const ANON_IP_STORE = URL_BASE + 'index.php/Api/Post/recordAnonIP';

const myIP = ({ post }) => {

    //Call the function that record the IP
    Index(post.id);

    let image = Object;

    var imageArray = [];

    if ((post.images) && (post.images.length > 0)) {

        for (var i = 0; i < post.images.length; i++) {
                        
            //Add to Array to send to Image Carousel
            var imageObj = new Object();
            imageObj.src = URL_BASE + post.images[i];
            imageObj.altText = "Image " + (i + 1);
            imageArray.push(imageObj);
        }
    }
    else {

        var imageObj1 = new Object();
        imageObj1.src = "/images/noimage.jpeg";
        imageObj1.altText = "Image 1";
        imageArray.push(imageObj1);
    }


    return (
        <Layout>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:url" content="http://zanq.co" />
                
                <meta property="og:description" content={post.content.substring(0, post.content.indexOf('.'))} />
                <meta property="og:image" content={imageArray[0].src} />
                
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={post.nickname} />
                <meta property="twitter:description" content={post.content.substring(0, post.content.indexOf('.'))} />
                <meta property="twitter:image" content={imageArray[0].src} />
            </Head>  
            <React.Fragment>
                <Row className={styles.headerTagline}>
                    <Col md={3} xs={2}>
                        <img src="/images/default_logo.png" height="41" width="41" alt="ZanQ"></img>
                    </Col>
                    <Col md={9} xs={10}>
                        <span className="title-text">ZanQ: Anonymous Personal Stories</span>
                    </Col>
                </Row>
            </React.Fragment>    
            <header className={styles.header}>
                { 
                <>
                        <img
                        src={post.user_avatar}
                        className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                        alt={post.nickname}
                        />
                
                    <h4>
                        <div className={utilStyles.headingLg}>{post.nickname}</div>
                        <br />
                        <div className={utilStyles.headingSm}>Points: {post.user_score}</div>
                    </h4>    
                </>
                }
            </header>   
            <React.Fragment>
                <Card className="renderDetails">
                        <Slideshow items={imageArray} />
                        <CardBody className={previewStyles.white_space_pre}><Linkify>{post.content}</Linkify></CardBody>
                        <span className="borderbottom" />
                        <CardFooter>
                            <Row className="row-center">
                                <Col onClick={(e) => buttonClicked(e, "Zan Appreciations")} md={5} xs={4}>
                                    <Row className="ml-2">
                                        <img src="/images/ic_zan_logo.png" className="story-footer-margin-img" alt="Zanned Icon" />
                                        <span className="story-footer-margins">{post.praise_num}</span>
                                    </Row>
                                </Col>
                                <Col onClick={(e) => buttonClicked(e, "Comments")} md={5} xs={4}>
                                    <Row className="ml-1">
                                        <div className="fa fa-comments fa-lg story-footer-margin-img" />
                                        <span className="story-footer-margins">{post.comment_num}</span>
                                    </Row> 
                                </Col>
                                <Col md={2} xs={4}>
                                    <Row className="ml-1">
                                        <div className="fa fa-eye fa-lg story-footer-margin-img" />
                                        <span className="story-footer-margins">{post.number_visits}</span>
                                    </Row>
                                </Col>
                            </Row> 
                        </CardFooter>
                    </Card>
            </React.Fragment>
        </Layout>
    );
}

const getPost = async (id) => {
  
    const response = await sendID(id)
          .then((data) => {
  
              //Success
              if (data['code'] === 1) {
  
                  return (
                          data['data']

                  )
              }  
              else {
                  var error2 = new Error(data['message']);
                  throw error2;
              }  
          })
      .catch(error => console.log(error))
  
      return (
          response
      );
}

async function sendID (id) {

    //console.log("ID : " + id);

        //Data Object to Pass Through
        const DetailRequest = {
            postId: id,
        }
    
        //console.log("JSON : " + JSON.stringify(DetailRequest));

        let response = await fetch(ANON_POST_DETAILS, { 
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "params=" + JSON.stringify(DetailRequest) + "&developer=1",
        credentials: 'same-origin'
        })
        .then(response => {
                if (response.ok) {
                        return response;
                }
                else {
                        var error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                }
        },
        error => {
                var errorMessage = new Error(error.errorMessage);
                throw errorMessage;
        }) 
    
        let data = await response.json();
        
        return (
            data
        )
}

/******************** Store IP ************************/

/* Get IP */
async function fetcher(url) {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }
  
function Index(postID) {
  
    const { data, error } = useSWR(API_URL, fetcher);
  
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
  
    //This is our Client IP
    const { query } = data;

    //Send the Data to our Database to record
    send_IP_and_postID(query, postID);    

    return query;
    
}

async function send_IP_and_postID (ip, id) {

    console.log("ID : " + id);
    console.log("IP : " + ip);

    if (ip.length > 0) {

        //Data Object to Pass Through
        const DetailRequest = {
            ip: ip,
            postId: id,
        }
    
        //console.log("JSON : " + JSON.stringify(DetailRequest));

        fetch(ANON_IP_STORE, { 
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "params=" + JSON.stringify(DetailRequest) + "&developer=1",
        credentials: 'same-origin'
        })
        .then(response => {
                if (response.ok) {
                        return response;
                }
                else {
                        var error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                }
        },
        error => {
                var errorMessage = new Error(error.errorMessage);
                throw errorMessage;
        }) 
    }
}

//Changes the middle widget based on Navigations clicked
function buttonClicked(event, value) {

    //Split to figure out if user Clicked on Zan, Comment or Share
    var res = value;

     Swal.fire({
        icon: 'error',
        title: 'Registration Required',
        text: res + ' are only available to registered users',
        footer: '<a href="http://dev.zanq.co/Zan/">Register here</a>'
      })
}

export const getServerSideProps = async ({ query }) => {
    const { id } = query;

    let post = await getPost(id);
  
    return {
        props: {
          post,
        }
    }
}

export default myIP;
