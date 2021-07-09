import Nav from "components/Nav";

function Layout(props) {
  return (
    <div className="relative overflow-hidden">
      <Nav />
      <div>{props.children}</div>
    </div>
  );
}

export default Layout;
