import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BloodDonateScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bloodName:"",
      reasonToRequest:"",
      contactNumber: "",
      IsBookRequestActive : "",
      requestedBloodName: "",
      bloodStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (bloodName,reasonToRequest, contactNumber)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_blood').add({
        "user_id": userId,
        "blood_name":bloodName,
        "reason_to_request":reasonToRequest,
        "contact_number": contactNumber,
        "request_id"  : randomRequestId,
        "blood_status" : "donated",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getBookRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
  })

    this.setState({
        bloodName :'',
        reasonToRequest : '',
        contactNumber: '',
        requestId: randomRequestId
    })

    return Alert.alert("Your Donation has been Added Successfully")


  }

receivedBooks=(bloodName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_blood').add({
      "user_id": userId,
      "blood_name":bloodName,
      "request_id"  : requestId,
      "bookStatus"  : "donated",

  })
}




getIsBookRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsBookRequestActive:doc.data().IsBookRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getBookRequest =()=>{
  // getting the requested book
var bookRequest=  db.collection('requested_blood')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().blood_status !== "donated"){
        this.setState({
          requestId : doc.data().request_id,
          requestedBloodName: doc.data().blood_name,
          bloodStatus:doc.data().blood_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var bloodName =  doc.data().blood_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " donated the blood " + bloodName ,
            "notification_status" : "unread",
            "blood_name" : bloodName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getBookRequest()
  this.getIsBookRequestActive()

}

updateBookRequestStatus=()=>{
  //updating the book status after receiving the book
  db.collection('requested_blood').doc(this.state.docId)
  .update({
    blood_status : 'Donated'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsBookRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsBookRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"#ff8085",borderWidth:5,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text style = {{fontSize: 20}}>Blood Group</Text>
          <Text>{this.state.requestedBloodName}</Text>
          </View>
          <View style={{borderColor:"#ff8085",borderWidth:5,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text style = {{fontSize: 20}}> Blood Status </Text>

          <Text>{this.state.bloodStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"#ff8085",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus();
            this.receivedBooks(this.state.requestedBloodName)
          }}>
          <Text style = {{color: "#9e0000", fontSize: 20, fontWeight: 'bold'}}>I donated the blood </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Be A Donor" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"Your Blood Group"}
                onChangeText={(text)=>{
                    this.setState({
                        bloodName:text
                    })
                }}
                value={this.state.bloodName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:150}]}
                multiline
                numberOfLines ={8}
                placeholder={"Location"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
               <TextInput
                style ={[styles.formTextInput,{height:40}]}
                maxLength = {10}
                placeholder={"Contact Number"}
                onChangeText ={(text)=>{
                    this.setState({
                        contactNumber:text
                    })
                }}
                value ={this.state.contactNumber}
              />
              <Text style = {{marginTop: 50, textAlign: 'center', fontSize: 20, color: '#9e0000', fontWeight: 'bold'}}> 
              * Note * - If the donor is dealing with any medical or health problem his donation may be rejected.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.bloodName,this.state.reasonToRequest, this.state.contactNumber);
                }}
                >
                <Text  style={{color:'#ffc0cb', fontWeight: 'bold', fontSize: 20}}>Donate Blood</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#9e0000',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"black",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:70
    },
  }
)