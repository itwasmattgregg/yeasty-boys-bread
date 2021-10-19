import Layout from "components/Layout";
import { useState } from "react";

const Popup = () => {
  return (
    <>
      <Layout>
        <section className="mt-40 px-5 max-w-4xl mx-auto">
          <h1
            className="relative text-3xl md:text-5xl
              leading-tight font-bold"
          >
            The first ever Yeasty Boys popup: <br />
            <small>a fundraiser for young adult cancer survivors</small>
          </h1>
          <p>Saturday Oct. 23, 2021 at 10:00am</p>
          <p>
            If you would like to attend please select the items you are planning
            on ordering beforehand so I know how much to prepare for. Then fill
            out your name and hit submit.
          </p>
          <p>
            The food and drinks are free but we would love if you would donate
            an amount you would pay to go out for coffee to our pay it forward
            campaign for True North Treks{" "}
            <a href="https://bit.ly/tntmatt">here</a>. If you have already
            donated please enjoy the food on us!
          </p>
          <p></p>
        </section>
        <section className="px-5 max-w-4xl mx-auto">
          <form>
            <h2 className="text-2xl font-bold">Drinks</h2>
            <MenuOption name="Lumberjack latté (maple)" />
            <MenuOption name="Basic bitch latté (PSL)" />
            <MenuOption name="I still believe it's summer latté (lavender)" />
            <MenuOption name="Boring latté" />
            <h2 className="text-2xl font-bold">Food</h2>
            <MenuOption name="Classic sourdough bread" />
            <MenuOption name="Chocolate milk bun" />
            <MenuOption name="Fuck cancer scones" />
            <button>Submit</button>
          </form>
        </section>
      </Layout>
    </>
  );
};

function MenuOption({ name }) {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <label>
        {name}
        <input type="checkbox" onChange={() => setSelected(!selected)} />
      </label>
      <label>
        Quantity:
        <select disabled={selected}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </label>
    </>
  );
}

export default Popup;
