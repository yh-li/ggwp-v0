import React, { useState } from "react";

function Game() {
  const [zbLeft, setLeft] = useState(false);
  const [zbUpset, setUpset] = useState(false);

  //codes in then are going to run after resolve
  const zb = () => {
    return new Promise((res, rej) => {
      if (zbLeft) {
        rej({ name: "zb not here", message: "我不在家" });
      } else if (zbUpset) {
        rej({ name: "zb upset", message: "你好讨厌啊" });
      } else {
        res({ name: "Finally", message: "哦" });
      }
    });
  };
  zb()
    .then((message) => {
      console.log("张博终于可以做了");
      console.log(message.message);
      return "那就可以吃饭了";
    })
    .then((message) => {
      console.log("张博做完了");
      console.log(message);
    })
    .catch((err) => {
      console.log("张博不干");
      console.log(err);
    });
  function delay(ms) {
    // your code
    return new Promise((res) => {
      setTimeout(() => {
        res("Done");
      }, ms);
    });
  }

  delay(10000).then(() => alert("runs after 3 seconds"));
  async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
  }
  async function async2() {
    console.log("async2");
  }
  console.log("script start");
  async1();
  console.log("script end");
  return <div>1</div>;
}

export default Game;
