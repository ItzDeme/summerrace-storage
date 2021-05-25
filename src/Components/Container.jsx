import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ListItem from "./ListItem";

function Container(props) {
  const [groupItems, setGroupItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [newArray, setNewArray] = useState([]);
  const [email, setEmail] = useState("");
  const firebase = props.firebase;
  //fetching data for the charts
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const firestore = firebase.database().ref("/users/" + user.uid);
        firestore.on("value", (response) => {
          const data = response.val();
          let userInfo = [];
          for (let id in data) {
            userInfo.push({
              item: data[id],
            });
          }
          const [obj, id, info] = userInfo;
          setUserId(id.item);
          setEmail(obj.item);

          const infoTwo = info.item;
          // console.log();
          setItems(infoTwo);
        });
      } else {
        console.log("this is wrong");
      }
    });
    //setting items
    const setItems = (items) => {
      //sets new array for editing purpose
      setNewArray(items);
      //sets groupItems based off of prop.typeOf
      setGroupItems(items.filter((item) => item.category === props.typeOf));
    };
  }, []);
  //editing stuff
  function editItems(events) {
    //parsing Ints because events.name was a string
    const info = parseInt(events.name);
    let newAmount = parseInt(events.value);
    //making sure the value of newAmount didn't come out as NaN
    if (Number.isNaN(newAmount)) {
      newAmount = "";
    }
    //looping through newArray to change the amount in the object that has an id of item.ID
    newArray.forEach((item) => {
      if (item.ID === info) {
        item.amount = newAmount;
      }
    });
    //ordering the firebase by child of /items/ and looking for the one that's equal to info
    //this is good because firebase gave me numbered [0,1,2,...etc] keys
    const firestore = firebase
      .database()
      .ref("/users/" + userId + "/items/")
      .orderByChild("ID")
      .equalTo(info);
    //updates the amount of the snapshot (firesore) ref
    firestore.once("child_added", function (snapshot) {
      snapshot.ref.update({ amount: newAmount });
    });
  }

  return (
    <div className="col-lg-12 col-xl-6 col-sm-12 col-md-12 text-align container-fluid container">
      <h1>{props.typeOf}</h1>
      <Table striped bordered hover size="sm">
        <thead>
          {props.width < 500 ? (
            <tr>
              <th>ID</th>
              <th> </th>
              <th>Item Name</th>
              <th>Amount</th>
            </tr>
          ) : (
            <tr>
              <th>ID</th>
              <th> </th>
              <th>Item Name</th>
              <th>Amount</th>
              <th>Needed Per Race</th>
              <th>Who Drops?</th>
              <th>Percentage</th>
              <th>Price</th>
            </tr>
          )}
        </thead>
        <tbody>
          {groupItems.map((item) => (
            <ListItem
              editItems={editItems}
              twice={item.twoTimes}
              ten={item.tenTimes}
              fifty={item.fiftyTimes}
              width={props.width}
              key={item.ID}
              ID={item.ID}
              name={item.Name}
              amount={item.amount}
              perRace={item.perRace}
              whoDrops={item.whoDrops}
              monsterPercentage={item.monsterPercentage}
              zeny={item.zeny}
              image={item.itemImage}
              mobImage={item.monsterImage}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Container;
