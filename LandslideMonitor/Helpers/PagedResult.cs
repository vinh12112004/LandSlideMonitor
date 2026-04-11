namespace LandslideMonitor.Helpers;

public class PagedResult<T>
{
    public IEnumerable<T> Data { get; set; }

    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }

    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public PagedResult(IEnumerable<T> data, int count, int pageNumber, int pageSize)
    {
        Data = data;
        TotalCount = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }
}