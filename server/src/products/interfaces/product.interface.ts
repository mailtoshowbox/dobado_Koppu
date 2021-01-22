export interface Document {
  id?: string;
  name: string;
  description: string;
  box: string;
  rack:  string;
  category :  string; 
  box_info: [ Info ],
  rack_info: [ Info ],
  category_info: [Info]

}
interface Info{
  id :  string;
  name :  string;
}