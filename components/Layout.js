function Layout(props) {
  return (
    <div className='page-layout'>
      {props.children}
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 18px;
          line-height: 1.3;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          padding: 1rem;
        }
        .background-wrap {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          z-index: -1;
        }
        main {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 1rem;
        }
      `}</style>
    </div>
  );
}

export default Layout;
