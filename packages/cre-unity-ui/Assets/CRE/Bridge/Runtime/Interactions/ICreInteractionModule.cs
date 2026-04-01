namespace CRE.Bridge.Interactions
{
    public interface ICreInteractionModule
    {
        string Id { get; }
        void SetEnabled(bool enabled);
    }
}
