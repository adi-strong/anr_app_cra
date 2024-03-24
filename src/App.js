import React, {useEffect} from 'react';
import Contents from "./app/Contents";
import toast, {Toaster, ToastBar} from "react-hot-toast";
import {useDispatch} from "react-redux";
import {setup} from "./features/auth/services/auth.slice";

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => { dispatch(setup()) }, [dispatch])
  
  return (
    <>
      <Contents/>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          duration: 2000,
          
          success: {
            theme: {
              primary: 'blue',
              secondary: 'black'
            }
          }
        }}>
        {(t) => (
          <ToastBar toast={t}>
            {({icon, message}) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button onClick={() => toast.dismiss(t.id)} className='btn border-0'>
                    <i className='bi bi-x'/>
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default App;
