import React from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function ListItem(props) {
  //image of the monsters that will display on hover
  const image = props.mobImage;
  var mobLink = image.match(/(\d+)/);
  const rmsLink = `https://ratemyserver.net/mob_db.php?mob_id=${mobLink[0]}&small=1`;

  //set custom color for the text amount
  const customColor = {
    color: "",
  };
  if (props.amount <= props.twice || props.amount < props.ten) {
    customColor.color = "red";
  } else if (props.amount >= props.ten && props.amount < props.fifty) {
    customColor.color = "blue";
  } else {
    customColor.color = "green";
  }
  //Popover for the hover for monsters. They wanted a ref.
  const nodeRef = React.useRef(null);
  //same as above but just wanted to say using this gives me a findDOMNode error
  const showMob = (props, noderef) => (
    <Popover className={nodeRef} {...props}>
      <Popover.Content>
        <img src={image} alt={props.whoDrops} />
      </Popover.Content>
    </Popover>
  );
  //amount edit functionality, sends e.target to parents
  function editText(e) {
    props.editItems(e.target);
  }

  function showItem() {
    if (props.width < 500) {
      return (
        <tr>
          <td>{props.ID}</td>
          <td>
            <img src={props.image} alt={props.name} />
          </td>
          <td>
            <div>{props.name}</div>
          </td>
          <td style={customColor}>{props.amount}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{props.ID}</td>
          <td>
            <img src={props.image} alt={props.name} />
          </td>
          <td>
            <div>{props.name}</div>
          </td>
          <td>
            <input
              style={customColor}
              type="number"
              className="amount"
              name={props.ID}
              onChange={(e) => {
                editText(e);
              }}
              value={props.amount}
            />
          </td>
          <td>{props.perRace}</td>
          <td className="mob-name">
            <OverlayTrigger
              className={nodeRef}
              trigger={["hover", "hover"]}
              key={props.ID}
              animation="false"
              overlay={showMob}
            >
              <a href={rmsLink} rel="noopener noreferrer" target="_blank">
                {props.whoDrops}
              </a>
            </OverlayTrigger>
          </td>
          <td>{props.monsterPercentage}</td>
          <td>{props.zeny}</td>
        </tr>
      );
    }
  }

  return showItem();
}

export default ListItem;
