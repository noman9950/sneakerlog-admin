import React from 'react';
import {Route, Link} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
import routes from '../static/_routes';

const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const BreadcrumbsItem = ({match, location}) => {
  //console.log("pathname", location.pathname, match.url);
  const routeName = findRouteName(match.url);
  if (routeName) {
    const pathname = location.pathname.split('/');
    const matchpath = match.url.split('/');
    // if (Number(pathname[pathname.length-1])){ this was previous
    if (Number(pathname[pathname.length-1][0])){
      pathname.splice(-1,1);
    }
    //console.log("####", pathname.join('/'), matchpath.join('/'));
    return (
      (match.isExact && routeName !== "Home") ||
      (pathname.length === matchpath.length && pathname.join('/') === matchpath.join('/'))  ?
        (
          <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) :
        (
          <BreadcrumbItem>
            <Link to={match.url || ''}>
              {routeName}
            </Link>
          </BreadcrumbItem>
        )
    );
  }
  return null;
};

const Breadcrumbs = ({ location : {pathname}, match}) => {
  const paths = getPaths(pathname);
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};

export default props => (
  <div>
    <Route path="*" component={Breadcrumbs} {...props} />
  </div>
);
