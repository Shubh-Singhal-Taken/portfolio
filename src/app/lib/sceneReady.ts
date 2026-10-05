import { createContext, useContext } from "react";

/* True once the WebGL scene has painted its first frame and the loader
   has cleared. Pages hold their entrance animations until then, so none
   of them play out unseen behind the loader. */

export const SceneReadyContext = createContext(false);

export const useSceneReady = () => useContext(SceneReadyContext);
