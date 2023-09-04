import { Breadcrumbs, Link } from '@mui/material';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
// import RouterData from '../../../RouterData';

const BreadCrumb: React.FC<{ pathnames: any }> = ({ pathnames }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem('token');
  return (
    <>
      {user ? (
        <Breadcrumbs
          style={
            location?.pathname == '/login'
              ? { display: 'none' }
              : { backgroundColor: '#f7f7f7', fontSize: '14px' }
          }
          aria-label="breadcrumb"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div>
                <AiOutlineHome />
              </div>
              <div>
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate('/')}
                >
                  Home
                </Link>
              </div>

              <div>
                {pathnames?.length &&
                  pathnames?.map((pathname: any, index: number) => {
                    return (
                      // <>
                      //   {pathname?.parent ?
                      //     <div className="flex items-center" key={index}>
                      //     <MdKeyboardArrowRight />
                      //     <Link
                      //       style={{ textTransform: "capitalize" }}
                      //       underline="hover"
                      //       color="inherit"
                      //       href={pathname?.parent.pathname}
                      //     >
                      //       {pathname?.parent.label}
                      //     </Link>
                      //   </div> : null
                      //   }
                      //   <div className="flex items-center" key={index}>
                      //     <MdKeyboardArrowRight />
                      //     <Link
                      //       style={{ textTransform: "capitalize" }}
                      //       underline="hover"
                      //       color="inherit"
                      //       // href={pathname.pathname}
                      //     >
                      //       {pathname?.label}
                      //     </Link>
                      //   </div>
                      // </>
                      <div className="flex items-center">
                        {pathname?.parent && (
                          <div className="flex items-center">
                            <MdKeyboardArrowRight />
                            <Link
                              style={{ textTransform: 'capitalize' }}
                              underline="hover"
                              color="inherit"
                              onClick={() =>
                                navigate(pathname?.parent.pathname)
                              }
                            >
                              {pathname?.parent.label}
                            </Link>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MdKeyboardArrowRight />
                          <Link
                            style={{ textTransform: 'capitalize' }}
                            underline="hover"
                            color="inherit"
                            // href={pathname.pathname}
                          >
                            {pathname?.label}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Breadcrumbs>
      ) : (
        ''
      )}
    </>
  );
};
export default BreadCrumb;
