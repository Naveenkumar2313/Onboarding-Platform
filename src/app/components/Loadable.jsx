import { Suspense } from 'react';
import ParcLoading from './ParcLoading'; // This component exists in your template

const Loadable = (Component) => (props) => (
  <Suspense fallback={<ParcLoading />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;