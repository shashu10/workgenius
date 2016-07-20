interface IObservable {
    RegisterOnLoadListener(OnLoadListener: Function);
    RemoveOnLoadListener(OnLoadListener: Function);
    NotifyOnLoadListeners();
}