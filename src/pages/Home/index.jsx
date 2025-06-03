import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Filter from "../../components/home/Filter";
import FilterData from "../../components/home/FilterData";
import ApplyModal from "../../components/ApplyModal";
import NotificationModal from "../../components/NotificationModal";
import { setJobSelected, setJobsResult } from "../../slice/jobSlice";

import image1 from "../../assets/images/img1.jpg";
import image2 from "../../assets/images/img2.jpg";
import image3 from "../../assets/images/img3.jpg";
import imgJobNotFound from "../../assets/images/nofound.jpg";
import { jobApi } from "../../utils/api/jobApi";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobsResult } = useSelector((state) => state.job);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobNotFound, setJobNotFound] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [dataFilter, setDataFilter] = useState({
    salary: "",
    scale: "",
    wotkingForm: "",
    time: "",
  });

  useEffect(() => {
    const getJobs = async () => {
      const rs = await jobApi.getJobs();
      setJobs(rs);
      dispatch(setJobsResult(rs));
      dispatch(setJobSelected(rs[0]));
    };
    getJobs();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [dataFilter]);

  const handleSearch = async () => {
    setJobNotFound(false);
    let jobFiltered = [...jobs];
    const search = JSON.parse(localStorage.getItem("search")) || [];
    if (!search.includes(searchQuery)) {
      searchQuery.trim() && search.push(searchQuery);
    }
    localStorage.setItem("search", JSON.stringify(search));

    const { salary, scale, wotkingForm, time } = dataFilter;
    jobFiltered = await jobApi.searchJobs({
      title: searchQuery.toLowerCase(),
      salary,
      scale,
      wotkingForm,
      time,
    });

    dispatch(setJobsResult(jobFiltered));
    if (!jobFiltered.length) {
      setJobNotFound(true);
      return;
    }
    dispatch(setJobSelected(jobFiltered[0]));
    navigate(`/${jobFiltered[0]._id}`);
  };

  return (
    <div className="">
      <Filter
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dataFilter={dataFilter}
        setDataFilter={setDataFilter}
      />
      {jobsResult?.length ? (
        <FilterData jobs={jobsResult} />
      ) : jobNotFound ? (
        <div className="h-[60vh] bg-gray-300 flex justify-center items-center">
          <div className="bg-white flex flex-col items-center justify-center h-1/2 m-5 rounded-lg p-6 shadow-md w-full max-w-xl">
            <img
              src={imgJobNotFound}
              alt="job not found"
              className="h-1/2 object-cover mb-4"
            />
            <p className="text-center font-semibold text-xl md:text-2xl">
              Xin lỗi! Việc làm bạn đang tìm kiếm không tồn tại.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white w-full px-5! py-10! min-h-[600px]">
          <h2 className="text-center  font-bold text-xl md:text-3xl text-red-600">
            Công cụ tốt nhất cho hành trang ứng tuyển của bạn
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-around pt-10 gap-10">
            <div className="flex flex-col items-center w-full md:w-1/3">
              <img
                src={image1}
                alt="img1"
                className="h-72 w-auto object-cover"
              />
              <p className="text-center text-base md:text-lg pt-5">
                Danh sách việc làm "chất" liên tục cập nhật các lựa chọn mới
                nhất theo thị trường và xu hướng tìm kiếm.
              </p>
            </div>

            <div className="flex flex-col items-center w-full md:w-1/3">
              <img
                src={image2}
                alt="img2"
                className="h-72 w-auto object-cover"
              />
              <p className="text-center text-base md:text-lg pt-5">
                Kiến tạo hồ sơ với bố cục chuẩn mực, chuyên nghiệp dành riêng
                cho ngành IT, được nhiều nhà tuyển dụng đề xuất.
              </p>
            </div>

            <div className="flex flex-col items-center w-full md:w-1/3">
              <img
                src={image3}
                alt="img3"
                className="h-72 w-auto object-cover"
              />
              <p className="text-center text-base md:text-lg pt-5">
                Đừng bỏ lỡ cơ hội cập nhật thông tin lương thưởng, chế độ làm
                việc, nghề nghiệp và kiến thức ngành IT.
              </p>
            </div>
          </div>
        </div>
      )}
      <ApplyModal />
      <NotificationModal />
    </div>
  );
};

export default Home;
