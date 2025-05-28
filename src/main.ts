import '@/style.css';
import { Model } from '@/model/model';
import { View } from '@/view';
import { ModelLoader } from '@/resources';
import { Controller } from '@/controller';

(async () => {
  const loader = new ModelLoader();
  const promisedModels = loader.load();
  const model = new Model();
  model.init();
  const view = new View(model);
  const controller = new Controller(view.canvas, {
    onSwap: (col, row, col2, row2, dir) => {
      model.swap(col, row, col2, row2);
      view.swap(col, row, col2, row2, dir);
    }
  });
  setTimeout(() => {
    model.cascadeMatch();
    view.updateCrystals();
  }, 1000);
  controller.activate(true);
  const models = await promisedModels;
  view.initCrystals(models);
  view.start();
})();