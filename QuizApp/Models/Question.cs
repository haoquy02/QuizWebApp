using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.Models
{
    public class Question
    {
        [Key]
        public int QnID { get; set; }
        [Column(TypeName = "nvarchar(250)")]
        public string? QnInWords { get; set; }
        [Column(TypeName = "nvarchar(250)")]
        public string? ImageName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Option1 { get; set; } = string.Empty;
        [Column(TypeName = "nvarchar(50)")]
        public string Option2 { get; set; } = string.Empty;
        [Column(TypeName = "nvarchar(50)")]
        public string Option3 { get; set; } = string.Empty;
        [Column(TypeName = "nvarchar(50)")]
        public string Option4 { get; set; } = string.Empty;
        public int Answer { get; set; }
    }
}
