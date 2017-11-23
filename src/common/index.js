
import * as R from 'ramda';;



const mkDefaultObjTo = R.curry( (merge, defaultObj, obj) => {

    let _defaultObj = R.defaultTo( {}, defaultObj  );
    let _obj = R.defaultTo( _defaultObj, obj  );



    return merge( R.defaultTo, _defaultObj, _obj );
} )




export mkDefaultObjTo
