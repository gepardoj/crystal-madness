import './style.css';
import { Model } from './model';
import { View } from './view';
import { ModelLoader } from './resources';

(async () => {
  const loader = new ModelLoader();
  const promisedModels = loader.load();
  const model = new Model();
  model.init();
  const view = new View(model);
  const models = await promisedModels;
  view.initModels(models);
  view.start();
})()