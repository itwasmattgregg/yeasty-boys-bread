function Layout(props) {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="page-layout">{props.children}</div>
      </div>
    </div>
  );
}

export default Layout;
